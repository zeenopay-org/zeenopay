import React, { useState, useContext, useRef, useEffect } from "react";
import { EventContext } from "../../EventProvider";
import QRCodeStyling from "qr-code-styling";
import { toJpeg } from 'html-to-image';
import '../../assets/css/VotingCard.css';

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
    backgroundImage: 'gradient'
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

  // ONLY CHANGE: Enhanced image conversion for iOS compatibility
  const convertImageToBase64 = async (imgUrl, setBase64) => {
    try {
      // Try iOS-compatible fetch first
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      if (isIOS) {
        try {
          const response = await fetch(imgUrl, {
            method: 'GET',
            mode: "cors",
            cache: "no-cache",
            headers: {
              'Accept': 'image/*',
            }
          });
          if (response.ok) {
            const blob = await response.blob();
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                setBase64(reader.result);
                resolve(reader.result);
              };
              reader.onerror = () => {
                setBase64(imgUrl);
                resolve(imgUrl);
              };
              reader.readAsDataURL(blob);
            });
          }
        } catch (iosError) {
          // iOS fallback: use original URL
          setBase64(imgUrl);
          return imgUrl;
        }
      }
      
      // Original code for non-iOS
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
        setAssetsLoaded(true); // Prevent blocking on iOS
      }
    };
    
    loadImages();
  }, [event.misc_kv, contestant.avatar]);

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
      
      // ONLY CHANGE: Enhanced timing for iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      await new Promise(resolve => setTimeout(resolve, isIOS ? 400 : 200));
      
      // Check if it's mobile
      const isMobile = window.innerWidth <= 640;
      
      // Store original styles
      const originalStyle = cardRef.current.style.cssText;
      const gridElement = cardRef.current.querySelector('.main-grid');
      const originalGridClass = gridElement?.className;
      const contestantImage = cardRef.current.querySelector('.contestant-image, .contestant-image-placeholder');
      const procedureList = cardRef.current.querySelector('.procedure-list');
      const originalContestantImageStyle = contestantImage?.style.cssText;
      const originalProcedureListStyle = procedureList?.style.cssText;
      
      if (isMobile) {
        // Mobile-specific adjustments
        cardRef.current.style.width = '500px';
        cardRef.current.style.maxWidth = '500px';
        cardRef.current.style.minWidth = '500px';
        cardRef.current.style.height = '500px'; 
        
        if (contestantImage) {
          contestantImage.style.width = '300px';
          contestantImage.style.height = '300px';
          contestantImage.style.borderRadius = `${customizations.contestantImageRadius}px`;
          // ONLY CHANGE: iOS-specific image styling
          if (isIOS) {
            contestantImage.style.webkitTransform = 'translateZ(0)';
            contestantImage.style.backfaceVisibility = 'hidden';
          }
        }
        
        // Adjust procedure list to take less space
        if (procedureList) {
          procedureList.style.marginTop = '5px';
          procedureList.style.fontSize = '10px';
        }
        
        // Force grid to be 2 columns like desktop
        if (gridElement) {
          gridElement.classList.add('desktop-grid');
        }
      } else {
        // Desktop adjustments
        cardRef.current.style.width = '600px';
        cardRef.current.style.maxWidth = '600px';
        cardRef.current.style.minWidth = '600px';
        cardRef.current.style.height = '600px';
        
        if (contestantImage) {
          contestantImage.style.width = '200px';
          contestantImage.style.height = '200px';
        }
        
        if (procedureList) {
          procedureList.style.marginTop = '10px';
        }
        
        if (gridElement) {
          gridElement.classList.add('desktop-grid');
        }
      }
      
      // ONLY CHANGE: Enhanced wait time for iOS
      await new Promise(resolve => setTimeout(resolve, isIOS ? 300 : 100));
      
      // ONLY CHANGE: iOS-enhanced toJpeg options
      const toJpegOptions = {
        quality: 1.0,
        backgroundColor: customizations.gradientStart || '#000B44',
        pixelRatio: isMobile ? 2.8 : 2.4, 
        width: isMobile ? 500 : 600,
        height: isMobile ? 500 : 600,
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
      };
      
      // Add iOS-specific options
      if (isIOS) {
        toJpegOptions.useCORS = true;
        toJpegOptions.allowTaint = false;
      }
      
      const dataUrl = await toJpeg(cardRef.current, toJpegOptions);
      
      const link = document.createElement('a');
      link.download = `${contestant?.name || 'contestant'}-${event?.title || 'event'}-vote-card-HQ.jpg`.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
      link.href = dataUrl;
      
      // ONLY CHANGE: iOS download handling
      if (isIOS) {
        link.target = '_blank';
      }
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Restore original styles
      cardRef.current.style.cssText = originalStyle;
      if (gridElement && originalGridClass) {
        gridElement.className = originalGridClass;
      }
      
      // Restore contestant image and procedure list styles
      if (contestantImage && originalContestantImageStyle) {
        contestantImage.style.cssText = originalContestantImageStyle;
      } else if (contestantImage) {
        contestantImage.style.width = '';
        contestantImage.style.height = '';
      }
      
      if (procedureList && originalProcedureListStyle) {
        procedureList.style.cssText = originalProcedureListStyle;
      } else if (procedureList) {
        procedureList.style.marginTop = '';
        procedureList.style.fontSize = '';
      }
      
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      // ONLY CHANGE: Enhanced timing for iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      setTimeout(() => {
        const buttons = cardRef.current?.querySelectorAll('button');
        buttons?.forEach(button => {
          button.style.visibility = 'visible';
          button.style.display = 'flex';
          button.style.opacity = '1';
          button.style.pointerEvents = 'auto';
        });
        
        setDownloading(false);
      }, isIOS ? 1500 : 1000);
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
        
        {/* Professional Customizer Panel */}
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
              
              {/* Gradient Colors  */}
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
                    {downloading ? 'Downloading...' : 'Download Poster'}
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