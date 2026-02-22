import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import emailjs from "@emailjs/browser";
import Alert from "./Alert";

const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "",
    message: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  // service_y2gk1uk
  // Template_id template_qamrldh
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAlertInfo({ show: false, type: "", message: "" });
    try {
      console.log("Form submitted", formData);
      await emailjs.send(
        "service_y2gk1uk",
        "template_fax7kar",
        {
          from_name: formData.name,
          to_name: "Finance Club",
          from_email: formData.email,
          to_email: "pateltirth6745@gmail.com",
          message: formData.message,
        },
        "fuNd78CPhYljDhO18",
      );
      setAlertInfo({
        show: true,
        type: "success",
        message: "Message sent successfully!",
      });
      setFormData({
        name: "",
        email: "",
        message: "",
      });
      setTimeout(() => {
        onClose();
        setAlertInfo({ show: false, type: "", message: "" });
      }, 2000);
    } catch (error) {
      console.log("ERROR", error);
      setAlertInfo({
        show: true,
        type: "error",
        message: "Failed to send message. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <Motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full p-6 max-w-lg rounded-2xl border border-white/10 bg-[#1a1a1d] md:p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-white/40 hover:text-white transition-colors p-2"
            >
              <X className="cursor-pointer" size={24} />
            </button>

            <div className="mb-8">
              <h2 className="font-antonio text-3xl md:text-4xl text-white mb-2 tracking-wide">
                GET IN TOUCH
              </h2>
              <p className="text-white/60 font-light text-sm md:text-base">
                Have questions regarding Finstreet 2026? We'd love to hear from
                you.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs uppercase tracking-wider font-medium text-white/50 mb-1.5 ml-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/20 focus:border-[#D4AF37]/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 transition-all duration-300"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs uppercase tracking-wider font-medium text-white/50 mb-1.5 ml-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/20 focus:border-[#D4AF37]/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 transition-all duration-300"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs uppercase tracking-wider font-medium text-white/50 mb-1.5 ml-1"
                >
                  Message
                </label>
                <textarea
                  rows={4}
                  id="message"
                  name="message"
                  type="text"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="How can we help?"
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/20 focus:border-[#D4AF37]/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 transition-all duration-300 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-[#D4AF37] hover:bg-[#b5952f] py-3.5 font-bold text-[#1a1a1d] tracking-wide uppercase transition-all duration-300 transform active:scale-[0.98] shadow-lg hover:shadow-[#D4AF37]/20 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : "Send Message"}
              </button>
            </form>
            <Alert
              isOpen={alertInfo.show}
              type={alertInfo.type}
              message={alertInfo.message}
              onClose={() => setAlertInfo((prev) => ({ ...prev, show: false }))}
            />
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default ContactModal;
