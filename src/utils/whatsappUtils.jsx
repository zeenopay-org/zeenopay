export const generateWhatsAppLink = (phoneNumber, message) => {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };
  
  export const formatPhoneNumber = (phoneNumber) => {
    // Remove any non-numeric characters
    return phoneNumber.replace(/\D/g, '');
  };