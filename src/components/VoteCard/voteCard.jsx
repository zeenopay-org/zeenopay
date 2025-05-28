import React, { useState, useContext, useRef, useEffect } from "react";
import { EventContext } from "../../EventProvider";
import QRCodeStyling from "qr-code-styling";
import { toJpeg } from 'html-to-image';
import '../../assets/css/VotingCard.css'; // Import the CSS file

const VotingCard = ({ contestant, event, onClose }) => {
  const { generateStaticQr } = useContext(EventContext);
  const qrRef = useRef(null);
  const cardRef = useRef(null);

  const [qrString, setQrString] = useState("");
  const [loading, setLoading] = useState(true);
  const [eventImageBase64, setEventImageBase64] = useState("");
  const [contestantImageBase64, setContestantImageBase64] = useState("");
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Background images array
  const backgroundImages = [
    { id: 'gradient', name: 'Gradient', url: null },
    { id: 'bg1', name: 'Background 1', url: 'https://media.zeenopay.com/BACKGROUN_1.JPG' },
    { id: 'bg2', name: 'Background 2', url: 'https://media.zeenopay.com/BACKGROUND_2.JPG' },
    { id: 'bg3', name: 'Background 3', url: 'https://media.zeenopay.com/BACKGROUND_3.JPG' },
    { id: 'bg4', name: 'Background 4', url: 'https://media.zeenopay.com/BACKGROUND_4.JPG' },
    { id: 'bg5', name: 'Background 5', url: 'https://media.zeenopay.com/BACKGROUND_5.JPG' },
    { id: 'bg6', name: 'Background 6', url: 'https://media.zeenopay.com/BACKGROUND-6.JPG' },
    { id: 'bg7', name: 'Background 7', url: 'https://media.zeenopay.com/BACKGROUND_7.JPG' },
    { id: 'bg8', name: 'Background 8', url: 'https://media.zeenopay.com/BACKGROUND_8.JPG' }
  ];

  // Compact customization states
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customizations, setCustomizations] = useState({
    contestantImageRadius: 8,
    gradientStart: "#000B44",
    gradientMid1: "#001a66", 
    gradientMid2: "#002d88",
    gradientMid3: "#001966",
    gradientEnd: "#000822",
    backgroundImage: 'gradient' // Default to gradient
  });

  const defaultCustomizations = {
    contestantImageRadius: 8,
    gradientStart: "#000B44",
    gradientMid1: "#001a66",
    gradientMid2: "#002d88", 
    gradientMid3: "#001966",
    gradientEnd: "#000822",
    backgroundImage: 'gradient'
  };

  useEffect(() => {
    const fetchQR = async () => {
      try {
        setLoading(true);
        const qrData = await generateStaticQr(contestant.id, 0, event.id);
        if (qrData?.QR) setQrString(qrData.QR);
      } catch (error) {
        console.error("Error generating QR code:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQR();
  }, [contestant.id, event.id, generateStaticQr]);

  const renderQRCode = (qrString, ref) => {
    if (qrString && ref.current) {
      ref.current.innerHTML = "";
      const qrCode = new QRCodeStyling({
        width: 140,
        height: 140,
        type: "svg",
        data: qrString,
        image: "https://zeenorides.com/zeenopay_logo.svg",
        dotsOptions: { 
          color: "#39b6ff", 
          type: "extra-rounded" 
        },
        backgroundOptions: { 
          color: "#000" 
        },
        imageOptions: {
          crossOrigin: "anonymous",
          imageSize: 0.5,
          margin: 0,
          hideBackgroundDots: false,
        },
      });
      qrCode.append(ref.current);
    }
  };

  useEffect(() => renderQRCode(qrString, qrRef), [qrString]);

  const convertImageToBase64 = async (imgUrl, setBase64) => {
    try {
      const response = await fetch(imgUrl, {
        mode: "cors",
        cache: "no-cache",
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setBase64(reader.result);
          resolve(reader.result);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting image to base64:", error);
      setBase64(imgUrl);
      return imgUrl;
    }
  };

  useEffect(() => {
    const loadImages = async () => {
      try {
        const promises = [];
        if (event.misc_kv) promises.push(convertImageToBase64(event.misc_kv, setEventImageBase64));
        if (contestant.avatar) promises.push(convertImageToBase64(contestant.avatar, setContestantImageBase64));
        
        await Promise.all(promises);
        setAssetsLoaded(true);
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };
    
    loadImages();
  }, [event.misc_kv, contestant.avatar]);

  const downloadCardAsCanvas = async () => {
    if (downloading) return; // Prevent multiple simultaneous downloads
    
    try {
      setDownloading(true);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      // Perfect square format - 1440x1440
      canvas.width = 1440;
      canvas.height = 1440;
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Handle background
      const selectedBg = backgroundImages.find(bg => bg.id === customizations.backgroundImage);
      if (selectedBg && selectedBg.url) {
        try {
          const bgImg = new Image();
          bgImg.crossOrigin = "anonymous";
          await new Promise((resolve, reject) => {
            bgImg.onload = resolve;
            bgImg.onerror = reject;
            bgImg.src = selectedBg.url;
          });
          ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
          
          // Add dark overlay for text readability
          ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } catch (error) {
          console.error('Error loading background image, using gradient fallback');
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, customizations.gradientStart);
          gradient.addColorStop(0.25, customizations.gradientMid1);
          gradient.addColorStop(0.5, customizations.gradientMid2);
          gradient.addColorStop(0.75, customizations.gradientMid3);
          gradient.addColorStop(1, customizations.gradientEnd);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      } else {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, customizations.gradientStart);
        gradient.addColorStop(0.25, customizations.gradientMid1);
        gradient.addColorStop(0.5, customizations.gradientMid2);
        gradient.addColorStop(0.75, customizations.gradientMid3);
        gradient.addColorStop(1, customizations.gradientEnd);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Add radial gradients for depth (only for gradient background)
      if (customizations.backgroundImage === 'gradient') {
        const radialGrad1 = ctx.createRadialGradient(canvas.width * 0.2, canvas.height * 0.2, 0, canvas.width * 0.2, canvas.height * 0.2, canvas.width * 0.5);
        radialGrad1.addColorStop(0, 'rgba(59, 130, 246, 0.15)');
        radialGrad1.addColorStop(1, 'transparent');
        ctx.fillStyle = radialGrad1;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const radialGrad2 = ctx.createRadialGradient(canvas.width * 0.8, canvas.height * 0.8, 0, canvas.width * 0.8, canvas.height * 0.8, canvas.width * 0.5);
        radialGrad2.addColorStop(0, 'rgba(99, 102, 241, 0.1)');
        radialGrad2.addColorStop(1, 'transparent');
        ctx.fillStyle = radialGrad2;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Header section - Proportional to 1440x1440
      ctx.fillStyle = '#93c5fd';
      ctx.font = 'bold 30px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Multiple Votes Accepted!', canvas.width / 2, 70);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px Arial';
      ctx.fillText('QR code for multiple votes. Screenshot & share!', canvas.width / 2, 105);
      
      ctx.font = '20px Arial';
      ctx.fillText('(Banking Apps only)', canvas.width / 2, 135);
      
      // Line separator
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, 160);
      ctx.lineTo(canvas.width - 80, 160);
      ctx.stroke();
      
      // zeenoPay logo area
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('zeenoPay', 80, 200);
      
      // Event organizer
      ctx.textAlign = 'right';
      ctx.font = '20px Arial';
      ctx.fillText('Organized By:', canvas.width - 80, 185);
      ctx.fillStyle = '#93c5fd';
      ctx.font = 'bold 24px Arial';
      ctx.fillText(event?.org !== "N/A" && event?.org ? event.org : "ABC EVENTS", canvas.width - 80, 210);
      
      // Event title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(event?.title || "EVENT NAME", canvas.width / 2, 250);
      
      // Main content area - Adjusted for perfect square format (1440x1440)
      const leftX = 100;
      const rightX = canvas.width / 2 + 50;
      const topY = 290; // Moved up slightly
      
      // Left side - Contestant info with bigger image area
      ctx.fillStyle = '#93c5fd';
      ctx.font = '26px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Vote for:', leftX, topY);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 40px Arial';
      ctx.fillText(contestant?.name || "Contestant Name", leftX, topY + 45);
      
      // Load and draw contestant image if available - made bigger (400px)
      if (contestantImageBase64) {
        try {
          const contestantImg = new Image();
          contestantImg.crossOrigin = "anonymous";
          await new Promise((resolve, reject) => {
            contestantImg.onload = resolve;
            contestantImg.onerror = reject;
            contestantImg.src = contestantImageBase64;
          });
          
          // Draw contestant image with custom radius - increased size to 400px
          const imgSize = 400;
          const imgX = leftX;
          const imgY = topY + 75;
          
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(imgX, imgY, imgSize, imgSize, customizations.contestantImageRadius);
          ctx.clip();
          ctx.drawImage(contestantImg, imgX, imgY, imgSize, imgSize);
          ctx.restore();
        } catch (error) {
          console.error('Error loading contestant image');
          // Fallback placeholder
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillRect(leftX, topY + 75, 400, 400);
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('CONTESTANT', leftX + 200, topY + 250);
          ctx.fillText('IMAGE', leftX + 200, topY + 280);
        }
      } else {
        // Placeholder for contestant image - bigger size
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(leftX, topY + 75, 400, 400);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('CONTESTANT', leftX + 200, topY + 250);
        ctx.fillText('IMAGE', leftX + 200, topY + 280);
      }
      
      // Contestant number
      if (contestant?.misc_kv) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(leftX + 420, topY + 75, 80, 60);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(contestant.misc_kv, leftX + 460, topY + 115);
      }
      
      // Updated voting procedure - moved closer and reduced font sizes
      ctx.fillStyle = '#93c5fd';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('HOW TO VOTE ?', leftX, topY + 500); // Adjusted position
      
      // Updated procedure steps with smaller font
      const procedures = [
        `1. Go to zeenopay.com`,
        `2. Find MR & MS GRACE SEE NEPAL 2025`,
        `3. Click Get Started.`,
        `4. Select Vote Now.`,
        `5. Choose your contestant's voting number.`,
        `6. Enter your details.`,
        `7. Select your preferred payment method.`,
        `8. Log in and authenticate via OTP.`,
        `9. Wait for the Vote Success page.`,
        `10. Voting Can be done From Nepal, India & Abroad!`
      ];
      
      ctx.font = '16px Arial';
      procedures.forEach((step, index) => {
        if (index === 0) {
          ctx.fillStyle = '#39b6ff';
        } else if (index === 2 || index === 3) {
          ctx.fillStyle = '#4ade80';
        } else if (index === 9) {
          ctx.fillStyle = '#fbbf24';
        } else {
          ctx.fillStyle = '#cccccc';
        }
        ctx.fillText(step, leftX, topY + 535 + (index * 22)); // Adjusted position
      });
      
      // Right side - QR Code area
      ctx.fillStyle = '#93c5fd';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('SCAN QR CODE', rightX + 150, topY + 25);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.fillText('BANK APP TO VOTE', rightX + 150, topY + 55);
      
      // Draw QR Code if available
      if (qrString) {
        try {
          // Create a temporary QR code for canvas
          const tempDiv = document.createElement('div');
          document.body.appendChild(tempDiv);
          
          const qrCode = new QRCodeStyling({
            width: 340, 
            height: 340,
            type: "canvas",
            data: qrString,
            image: "https://zeenorides.com/zeenopay_logo.svg",
            dotsOptions: { 
              color: "#39b6ff", 
              type: "extra-rounded" 
            },
            backgroundOptions: { 
              color: "#fff" 
            },
            imageOptions: {
              crossOrigin: "anonymous",
              imageSize: 0.5,
              margin: 0,
              hideBackgroundDots: false,
            },
          });
          
          await new Promise((resolve) => {
            qrCode.append(tempDiv);
            setTimeout(() => {
              const qrCanvas = tempDiv.querySelector('canvas');
              if (qrCanvas) {
                ctx.drawImage(qrCanvas, rightX + 30, topY + 85, 240, 240);
              }
              document.body.removeChild(tempDiv);
              resolve();
            }, 100);
          });
        } catch (error) {
          console.error('Error drawing QR code:', error);
          // QR Code placeholder
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(rightX + 30, topY + 85, 240, 240);
          ctx.fillStyle = '#000';
          ctx.fillRect(rightX + 40, topY + 95, 220, 220);
          ctx.fillStyle = '#39b6ff';
          ctx.font = 'bold 20px Arial';
          ctx.fillText('QR CODE', rightX + 150, topY + 215);
        }
      } else {
        // QR Code placeholder
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(rightX + 30, topY + 85, 240, 240);
        ctx.fillStyle = '#000';
        ctx.fillRect(rightX + 40, topY + 95, 220, 220);
        ctx.fillStyle = '#39b6ff';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('QR CODE', rightX + 150, topY + 215);
      }
      
      // Voting notes - moved closer to QR code with smaller fonts
      const notesY = topY + 350;
      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 16px Arial';
      ctx.fillText('Note: Min 1, no limits', rightX + 150, notesY);
      
      ctx.fillStyle = '#cccccc';
      ctx.font = '14px Arial';
      ctx.fillText('Multiple votes allowed', rightX + 150, notesY + 25);
      
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 16px Arial';
      ctx.fillText('1 Vote = 10 Rs.', rightX + 150, notesY + 50);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.fillText('Divisible by 10', rightX + 150, notesY + 75);
      
      ctx.font = '12px Arial';
      ctx.fillText('T&C apply', rightX + 150, notesY + 100);
      
      // Event logo in bottom section if available - moved higher to reduce gap
      if (eventImageBase64) {
        try {
          const eventImg = new Image();
          eventImg.crossOrigin = "anonymous";
          await new Promise((resolve, reject) => {
            eventImg.onload = resolve;
            eventImg.onerror = reject;
            eventImg.src = eventImageBase64;
          });
          
          // Draw event logo at bottom - moved higher
          const logoSize = 100;
          const logoX = canvas.width / 2 - logoSize / 2;
          const logoY = canvas.height - 150; // Reduced from 200 to 150 to reduce bottom gap
          
          ctx.save();
          ctx.beginPath();
          ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(eventImg, logoX, logoY, logoSize, logoSize);
          ctx.restore();
        } catch (error) {
          console.error('Error loading event image');
        }
      }
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${contestant?.name || 'contestant'}-${event?.title || 'event'}-vote-card-HD.jpg`.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Success feedback
        console.log('Canvas download completed successfully');
      }, 'image/jpeg', 0.95);
      
    } catch (error) {
      console.error('Canvas download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      // Always reset downloading state
      setTimeout(() => {
        setDownloading(false);
      }, 1000);
    }
  };

  const downloadCardAsJpg = async () => {
    if (!cardRef.current || downloading) return;
    
    try {
      setDownloading(true);
      
      const buttons = cardRef.current.querySelectorAll('button');
      const wasCustomizerVisible = showCustomizer;
      
      setShowCustomizer(false);
      
      buttons.forEach(button => {
        button.style.visibility = 'hidden';
        button.style.display = 'none';
        button.style.opacity = '0';
        button.style.pointerEvents = 'none';
      });
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Force desktop layout for download - Square format
      const originalStyle = cardRef.current.style.cssText;
      cardRef.current.style.width = '600px';
      cardRef.current.style.maxWidth = '600px';
      cardRef.current.style.minWidth = '600px';
      cardRef.current.style.height = '600px'; // Square format
      
      // Force grid to be 2 columns like desktop
      const gridElement = cardRef.current.querySelector('.main-grid');
      const originalGridClass = gridElement?.className;
      if (gridElement) {
        gridElement.classList.add('desktop-grid');
      }
      
      // Make contestant image bigger in downloaded version
      const contestantImage = cardRef.current.querySelector('.contestant-image, .contestant-image-placeholder');
      if (contestantImage) {
        contestantImage.style.width = '200px';
        contestantImage.style.height = '200px';
      }
      
      // Adjust procedure list position
      const procedureList = cardRef.current.querySelector('.procedure-list');
      if (procedureList) {
        procedureList.style.marginTop = '10px';
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await toJpeg(cardRef.current, {
        quality: 1.0,
        backgroundColor: customizations.gradientStart || '#000B44',
        pixelRatio: 2.4,
        width: 600,
        height: 600, // Square format
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          fontSmoothing: 'antialiased',
          WebkitFontSmoothing: 'antialiased'
        },
        filter: (node) => {
          if (node.tagName === 'BUTTON') return false;
          if (node.classList && (
            node.classList.contains('customizer-overlay') ||
            node.classList.contains('customizer-panel') ||
            node.classList.contains('download-btn')
          )) return false;
          if (node.className && typeof node.className === 'string' && (
            node.className.includes('customizer') ||
            node.className.includes('button') ||
            node.className.includes('btn')
          )) return false;
          return true;
        },
        includeQueryParams: true
      });
      
      const link = document.createElement('a');
      link.download = `${contestant?.name || 'contestant'}-${event?.title || 'event'}-vote-card-HQ.jpg`.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Restore original styles
      cardRef.current.style.cssText = originalStyle;
      if (gridElement && originalGridClass) {
        gridElement.className = originalGridClass;
      }
      
      // Restore contestant image size
      if (contestantImage) {
        contestantImage.style.width = '90px';
        contestantImage.style.height = '90px';
      }
      
      // Restore procedure list position
      if (procedureList) {
        procedureList.style.marginTop = '';
      }
      
      console.log('HTML-to-image download completed successfully');
      
    } catch (error) {
      console.error('HTML-to-image failed, using enhanced canvas method:', error);
      await downloadCardAsCanvas();
    } finally {
      // Always restore buttons and reset state
      setTimeout(() => {
        const buttons = cardRef.current?.querySelectorAll('button');
        buttons?.forEach(button => {
          button.style.visibility = 'visible';
          button.style.display = 'flex';
          button.style.opacity = '1';
          button.style.pointerEvents = 'auto';
        });
        
        if (wasCustomizerVisible) {
          setShowCustomizer(true);
        }
        
        setDownloading(false);
      }, 1000);
    }
  };

  const updateCustomization = (key, value) => {
    setCustomizations(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetCustomizations = () => {
    setCustomizations(defaultCustomizations);
  };

  const getImageStyle = (isContestant = false) => {
    if (isContestant) {
      return {
        width: '90px',
        height: '90px',
        borderRadius: `${customizations.contestantImageRadius}px`
      };
    } else {
      return {
        width: '36px',
        height: '36px',
        borderRadius: '50%'
      };
    }
  };

  const getBackgroundStyle = () => {
    const selectedBg = backgroundImages.find(bg => bg.id === customizations.backgroundImage);
    
    if (selectedBg && selectedBg.url) {
      return {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${selectedBg.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    } else {
      return {
        background: `
          linear-gradient(135deg, 
            ${customizations.gradientStart} 0%, 
            ${customizations.gradientMid1} 25%, 
            ${customizations.gradientMid2} 50%, 
            ${customizations.gradientMid3} 75%, 
            ${customizations.gradientEnd} 100%
          ),
          radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)
        `,
      };
    }
  };

  return (
    <div className="voting-card-overlay">
      
      {/* Main Card Container with Customizer at Top */}
      <div className="card-container">
        
        {/* Professional Customizer Panel - Attached to Top of Modal */}
        {showCustomizer && (
          <div className="customizer-panel">
            <div className="customizer-content">
              {/* Header */}
              <div className="customizer-header">
                <h3>Customize Card</h3>
                <button
                  onClick={() => setShowCustomizer(false)}
                  className="close-btn"
                >
                  ✕
                </button>
              </div>
              
              {/* Background Selection */}
              <div className="customizer-section">
                <label className="section-label">Background</label>
                <div className="background-grid">
                  {backgroundImages.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => updateCustomization('backgroundImage', bg.id)}
                      className={`bg-option ${customizations.backgroundImage === bg.id ? 'active' : ''}`}
                      style={bg.url ? {
                        backgroundImage: `url(${bg.url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      } : {
                        background: 'linear-gradient(135deg, #000B44, #002d88)'
                      }}
                    >
                      {!bg.url && (
                        <span className="gradient-text">Grad</span>
                      )}
                      {customizations.backgroundImage === bg.id && (
                        <div className="active-overlay">
                          <span className="checkmark">✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Image Radius Controls - Only Contestant */}
              <div className="customizer-section">
                <label className="section-label">Image Corners</label>
                <div className="radius-control">
                  <div>
                    <label className="control-label">Contestant Image ({customizations.contestantImageRadius}px)</label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={customizations.contestantImageRadius}
                      onChange={(e) => updateCustomization('contestantImageRadius', parseInt(e.target.value))}
                      className="range-slider"
                    />
                    <p className="helper-text">Event logo is always circular</p>
                  </div>
                </div>
              </div>
              
              {/* Gradient Colors (only show if gradient background is selected) */}
              {customizations.backgroundImage === 'gradient' && (
                <div className="customizer-section">
                  <label className="section-label">Gradient Colors</label>
                  <div className="gradient-colors">
                    {[
                      { key: 'gradientStart', label: 'Start' },
                      { key: 'gradientMid1', label: 'Mid 1' },
                      { key: 'gradientMid2', label: 'Mid 2' },
                      { key: 'gradientMid3', label: 'Mid 3' },
                      { key: 'gradientEnd', label: 'End' }
                    ].map(({ key, label }) => (
                      <div key={key} className="color-input">
                        <label className="color-label">{label}</label>
                        <input
                          type="color"
                          value={customizations[key]}
                          onChange={(e) => updateCustomization(key, e.target.value)}
                          className="color-picker"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="customizer-actions">
                <button
                  onClick={resetCustomizations}
                  className="reset-btn"
                >
                  Reset All
                </button>
                <div className="download-buttons">
                  <button
                    onClick={downloadCardAsJpg}
                    disabled={downloading}
                    className="download-btn hq-btn"
                  >
                    {downloading ? 'Downloading...' : 'Download HQ'}
                  </button>
                  <button
                    onClick={downloadCardAsCanvas}
                    disabled={downloading}
                    className="download-btn hd-btn"
                  >
                    {downloading ? 'Processing...' : 'Download HD'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Card */}
        <div 
          ref={cardRef}
          className="voting-card"
          style={{
            marginTop: showCustomizer ? '160px' : '0',
            ...getBackgroundStyle()
          }}
        >
          {/* Action Buttons */}
          <div className="card-actions">
            <button
              onClick={() => setShowCustomizer(!showCustomizer)}
              className="action-btn customize-btn"
              title="Customize"
            >
              ⚙
            </button>
            <button
              onClick={onClose}
              className="action-btn close-btn"
            >
              ✕
            </button>
          </div>

          {/* Header */}
          <div className="card-header">
            <h1 className="header-title">
              Multiple Votes Accepted!
            </h1>
            <p className="header-subtitle">
              QR code for multiple votes. Screenshot & share!
            </p>
            <p className="header-note">
              (Banking Apps only)
            </p>
          </div>

          {/* Main Content */}
          <div className="card-content">
            {/* Top Section - Logo and Event */}
            <div className="top-section">
              <div className="logo-section">
                <img 
                  src="https://media.zeenopay.com/ZEENOPAY_MAIN_LOGO_BLUE.PNG" 
                  alt="zeenoPay"
                  className="zeeno-logo"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="organizer-section">
                <p className="organizer-label">Organized By:</p>
                <p className="organizer-name">
                  {event?.org !== "N/A" && event?.org ? event.org : "ABC EVENTS"}
                </p>
              </div>
            </div>

            {/* Event Logo and Name */}
            <div className="event-section">
              <div className="event-logo-wrapper">
                {eventImageBase64 ? (
                  <img
                    src={eventImageBase64}
                    alt="Event"
                    className="event-logo"
                    style={getImageStyle(false)}
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div 
                    className="event-logo-placeholder"
                    style={getImageStyle(false)}
                  >
                    LOGO
                  </div>
                )}
              </div>
              <h2 className="event-title">
                {event?.title || "EVENT NAME"}
              </h2>
            </div>

            {/* Main Grid */}
            <div className="main-grid">
              
              {/* Left - Contestant & Procedure */}
              <div className="left-section">
                {/* Contestant Info */}
                <div className="contestant-card">
                  <div className="contestant-info">
                    <div className="contestant-image-wrapper">
                      {contestantImageBase64 ? (
                        <img
                          src={contestantImageBase64}
                          alt="Contestant"
                          className="contestant-image"
                          style={getImageStyle(true)}
                          crossOrigin="anonymous"
                        />
                      ) : (
                        <div 
                          className="contestant-image-placeholder"
                          style={getImageStyle(true)}
                        >
                          Loading...
                        </div>
                      )}
                      {contestant?.misc_kv && (
                       <div className="contestant-number">
                         {contestant.misc_kv}
                       </div>                     
                      )}
                    </div>
                    
                    <div className="contestant-details">
                      <p className="vote-label">Vote for:</p>
                      <h3 className="contestant-name">
                        {contestant?.name || "Contestant"}
                      </h3>
                      <div className="name-underline"></div>
                    </div>
                  </div>
                </div>

                {/* Voting Procedure */}
                <div className="procedure-card">
                  <h4 className="procedure-title">
                    HOW TO VOTE ?
                  </h4>
                  <ol className="procedure-list">
                    <li>1. Go to <span className="highlight-blue">zeenopay.com</span></li>
                    <li>2. Find MR & MS GRACE SEE NEPAL 2025</li>
                    <li><span className="highlight-green">3. Click Get Started.</span></li>
                    <li><span className="highlight-green">4. Select Vote Now.</span></li>
                    <li>5. Choose your contestant's voting number.</li>
                    <li>6. Enter your details.</li>
                    <li>7. Select your preferred payment method.</li>
                    <li>8. Log in and authenticate via OTP.</li>
                    <li>9. Wait for the Vote Success page.</li>
                    <li className="highlight-yellow">10. Voting Can be done From Nepal, India & Abroad!</li>
                  </ol>
                </div>
              </div>

              {/* Right - QR Code */}
              <div className="right-section">
                <div className="qr-section">
                  <div className="qr-wrapper">
                    <div ref={qrRef} className="qr-container">
                      {loading && (
                        <div className="qr-loading">
                          <span>Loading...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="qr-info">
                    <h3 className="qr-title">
                      SCAN QR CODE
                    </h3>
                    <h4 className="qr-subtitle">
                      BANK APP TO VOTE
                    </h4>

                    <div className="voting-notes">
                      <p>
                        <span className="note-label">Note:</span> 
                        <span className="note-text"> Min 1, no limits</span>
                      </p>
                      <p className="note-text">Multiple votes allowed</p>
                      <p className="vote-price">1 Vote = 10 Rs.</p>
                      <p className="divisible-note">Divisible by 10</p>
                      <p className="terms-note">T&C apply</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingCard;