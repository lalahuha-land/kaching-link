export const botTemplate = (title: string, description: string, ogImage: string, ogImageType: string, ogWidth: string, ogHeight: string) => `
<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Open Graph / Facebook / Threads / WhatsApp -->
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:secure_url" content="${ogImage}" />
    <meta property="og:image:type" content="${ogImageType}" />
    <meta property="og:image:width" content="${ogWidth}" />
    <meta property="og:image:height" content="${ogHeight}" />
    <meta property="og:type" content="website" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${ogImage}" />
    
    <style>
      body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #F5F2ED; color: #1A1A1A; text-align: center; }
      .card { background: white; padding: 3rem 2rem; border-radius: 2.5rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1); max-width: 450px; width: 90%; border: 1px solid rgba(0,0,0,0.05); }
      .icon { font-size: 4rem; margin-bottom: 1.5rem; display: block; }
      h1 { color: #FF6321; font-size: 2rem; margin-bottom: 1rem; font-weight: 800; letter-spacing: -0.02em; }
      p { opacity: 0.6; line-height: 1.6; font-size: 1.1rem; }
    </style>
  </head>
  <body>
    <div class="card">
      <span class="icon">🧧</span>
      <h1>${title}</h1>
      <p>${description}</p>
    </div>
  </body>
</html>
`;

export const error404Template = () => `
<!DOCTYPE html>
<html>
  <head>
    <title>Pautan Tamat Tempoh | Ka-ching Link</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      :root { --primary: #FF6321; --bg: #F5F2ED; }
      body { 
        font-family: system-ui, -apple-system, sans-serif; 
        display: flex; 
        flex-direction: column;
        align-items: center; 
        justify-content: center; 
        height: 100vh; 
        margin: 0; 
        background: var(--bg); 
        color: #1A1A1A;
        text-align: center;
        overflow: hidden;
      }
      
      body::before {
        content: "";
        position: absolute;
        inset: 0;
        opacity: 0.03;
        background-image: radial-gradient(#1A1A1A 1px, transparent 1px);
        background-size: 24px 24px;
        pointer-events: none;
      }

      .card { 
        background: white; 
        padding: 4rem 2rem; 
        border-radius: 3rem; 
        box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.1); 
        max-width: 400px; 
        width: 85%;
        position: relative;
        z-index: 1;
        border: 1px solid rgba(0,0,0,0.05);
        animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
      }

      @keyframes shake {
        10%, 90% { transform: translate3d(-1px, 0, 0); }
        20%, 80% { transform: translate3d(2px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
        40%, 60% { transform: translate3d(4px, 0, 0); }
      }

      .icon-container {
        width: 100px;
        height: 100px;
        background: #FEE2E2;
        border-radius: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 2rem;
        color: #EF4444;
      }

      h1 { 
        color: #1A1A1A; 
        font-size: 2rem; 
        margin: 0 0 1rem; 
        font-weight: 800; 
        letter-spacing: -0.02em;
      }

      p { 
        opacity: 0.5; 
        line-height: 1.6; 
        font-size: 1.1rem; 
        margin-bottom: 2.5rem;
      }

      .btn {
        display: inline-block;
        background: var(--primary);
        color: white;
        padding: 1rem 2rem;
        border-radius: 1.5rem;
        font-weight: 700;
        text-decoration: none;
        transition: all 0.2s ease;
        box-shadow: 0 10px 20px rgba(255, 99, 33, 0.2);
      }

      .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 30px rgba(255, 99, 33, 0.3);
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="icon-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/><line x1="10" y1="11" x2="14" y2="15"/><line x1="14" y1="11" x2="10" y2="15"/></svg>
      </div>
      <h1>Alamak, Poket Kosong!</h1>
      <p>Pautan ini telah tamat tempoh atau tidak lagi wujud dalam sistem kami.</p>
      <a href="/" class="btn">Jana Pautan Baru</a>
    </div>
  </body>
</html>
`;

export const humanRedirectTemplate = (tngUrl: string) => `
<!DOCTYPE html>
<html>
  <head>
    <title>Menghubungkan ke Duit Raya...</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      :root { --primary: #FF6321; --bg: #F5F2ED; }
      body { 
        font-family: system-ui, -apple-system, sans-serif; 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center; 
        height: 100vh; 
        margin: 0; 
        background: var(--bg); 
        color: #1A1A1A;
        overflow: hidden;
      }
      
      /* Background Pattern */
      body::before {
        content: "";
        position: absolute;
        inset: 0;
        opacity: 0.03;
        background-image: radial-gradient(#1A1A1A 1px, transparent 1px);
        background-size: 24px 24px;
        pointer-events: none;
      }

      .card {
        background: white;
        padding: 4rem 2rem;
        border-radius: 3rem;
        box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.15);
        text-align: center;
        max-width: 400px;
        width: 85%;
        position: relative;
        z-index: 1;
        border: 1px solid rgba(0,0,0,0.05);
        transform: translateY(0);
        animation: entry 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      @keyframes entry {
        from { opacity: 0; transform: translateY(40px) scale(0.9); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      /* Rotating Wallet Animation (Simulating GIF) */
      .wallet-container {
        width: 120px;
        height: 120px;
        margin: 0 auto 2.5rem;
        perspective: 1000px;
      }

      .wallet {
        width: 100%;
        height: 100%;
        background: var(--primary);
        border-radius: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 20px 40px rgba(255, 99, 33, 0.3);
        animation: float 3s ease-in-out infinite, rotate 4s linear infinite;
        transform-style: preserve-3d;
      }

      .wallet svg {
        width: 60px;
        height: 60px;
        color: white;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-15px); }
      }

      @keyframes rotate {
        0% { transform: rotateY(0deg); }
        100% { transform: rotateY(360deg); }
      }

      h2 { 
        margin: 0 0 0.5rem; 
        font-size: 1.75rem; 
        font-weight: 800; 
        letter-spacing: -0.03em; 
        color: #1A1A1A;
      }
      
      p { 
        opacity: 0.5; 
        font-size: 1rem; 
        margin: 0;
        line-height: 1.5;
      }

      .progress-bar {
        width: 100%;
        height: 6px;
        background: #F0F0F0;
        border-radius: 10px;
        margin-top: 2.5rem;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background: var(--primary);
        width: 0%;
        animation: fill 1.5s linear forwards;
      }

      @keyframes fill {
        to { width: 100%; }
      }

      /* Festive Sparkles */
      .sparkle {
        position: absolute;
        width: 10px;
        height: 10px;
        background: var(--primary);
        border-radius: 50%;
        opacity: 0;
        animation: sparkle-anim 2s infinite;
      }

      @keyframes sparkle-anim {
        0% { transform: scale(0) rotate(0deg); opacity: 0; }
        50% { opacity: 0.8; }
        100% { transform: scale(1.5) rotate(180deg); opacity: 0; }
      }
    </style>
    <script>
      setTimeout(() => {
        window.location.href = "${tngUrl}";
      }, 1500);
    </script>
  </head>
  <body>
    <div class="card">
      <div class="wallet-container">
        <div class="wallet">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
        </div>
      </div>
      <h2>Menyediakan Duit Raya...</h2>
      <p>Sila tunggu sebentar, anda akan dibawa ke Touch 'n Go eWallet.</p>
      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>
    </div>
    
    <!-- Decorative Sparkles -->
    <div class="sparkle" style="top: 20%; left: 20%; animation-delay: 0.1s;"></div>
    <div class="sparkle" style="top: 70%; left: 80%; animation-delay: 0.5s;"></div>
    <div class="sparkle" style="top: 40%; left: 85%; animation-delay: 0.8s;"></div>
    <div class="sparkle" style="top: 80%; left: 15%; animation-delay: 1.2s;"></div>
  </body>
</html>
`;
