// import Image from "next/image";
// import ProgressBar from "@ramonak/react-progress-bar";
// import { useState } from "react";
// import Link from "next/link";

// import styles from "../styles/Home.module.css";
// import mintUpimg from "../public/images/mint-up.svg";
// import mintDownimg from "../public/images/mint-down.svg";
// import ethLogo from "../public/images/eth-logo.svg";
// import mainLogo from "../public/images/pdrive-main-logo.png";
// import mainLogoM from "../public/images/pdrive-main-logo-m.png";
// import soundOn from "../public/images/sound-on.svg";
// import soundOff from "../public/images/sound-off.svg";
// import twitterLogo from "../public/images/twitter-logo.svg";
// import PriceDetails from "../components/PriceDetails";

// export default function Dashboard() {
//   const [showSound, setSound] = useState(false);
//   const [showWallet, setWallet] = useState(false);
//   const [showMint, setMint] = useState(false);
//   const [showConnection, setConnection] = useState("");
//   const [showNum, setNum] = useState(0);

//   const connectWallet = (e) => {
//     e.preventDefault();
//     setConnection("connecting");
//     setTimeout(function () {
//       setConnection("connected");
//       setWallet(true);
//     }, 2000);
//   };

//   const mintNow = () => {
//     if (showNum > 0) {
//       setConnection("minting");
//       setTimeout(function () {
//         setConnection("minted");
//         setMint(true);
//       }, 2000);
//     }
//   };

//   const togglePlay = () => {
//     var audio = document.getElementById("audio");
//     if (audio.paused) {
//       setSound(true);
//       audio.play();
//     } else {
//       setSound(false);
//       audio.pause();
//       // audio.currentTime = 0;
//     }
//   };

//   const incCount = () => {
//     setNum(showNum + 1);
//   };

//   const decCount = () => {
//     if (showNum != 0) {
//       setNum(showNum - 1);
//     }
//   };

//   return (
//     <>
//       <main className={styles.pdrive_landing_page}>
//         <div className={styles.pdrive_hero_section}>
//           <div className={styles.pdrive_page_top}>
//             <div className={styles.pdrive_logo_box}>
//               <div className={styles.pdrive_logo_img}>
//                 <div className={styles.pdrive_logo_src}>
//                   <Image src={ethLogo} alt="Logo" width={65} height={105} />
//                 </div>
//               </div>
//               <div className={styles.cnt_wallet}>
//                 {!showWallet ? (
//                   <a
//                     href=""
//                     onClick={(e) => {
//                       connectWallet(e);
//                     }}
//                     className={`${styles.cnt_walet_text} ${styles.font_style_1}`}
//                   >
//                     CONNECT WALLET
//                   </a>
//                 ) : (
//                   <>
//                     <article
//                       className={`${styles.font_style_1} ${styles.cnt_walet_text} `}
//                     >
//                       WALLET CONNECTED
//                     </article>
//                     <article
//                       className={`${styles.font_style_1} ${styles.cnt_wallet_adr} `}
//                     >
//                       0x29...C938
//                     </article>
//                     <span className={styles.showinmobile}>
//                       <PriceDetails showWallet={showWallet} />
//                     </span>
//                   </>
//                 )}
//               </div>
//             </div>
//             <div className={`${styles.eth_details_box}`}>
//               <span className={styles.showindesktop}>
//                 <PriceDetails showWallet={showWallet} />
//               </span>
//             </div>
//           </div>
//           <div className={styles.pdrive_page_body}>
//             <span className={styles.showindesktop_f}>
//               <Image
//                 className={styles.main_logo_pepe}
//                 src={mainLogo}
//                 alt="Logo"
//               />
//             </span>
//             <span className={styles.showinmobile_f}>
//               <Image
//                 className={styles.main_logo_pepe}
//                 src={mainLogoM}
//                 alt="Logo"
//               />
//             </span>

//             <div className={styles.pdrive_mint_steps}>
//               {showMint == true ? (
//                 <article
//                   className={`${styles.font_style_1} ${styles.extra_lh}`}
//                 >
//                   YOU SUCCESSFULLY
//                   <br />
//                   MINTED {showNum} PEPE DRIVE NFTS
//                 </article>
//               ) : showWallet == true ? (
//                 <>
//                   <div className={`${styles.mb} ${styles.count_flex}`}>
//                     <div className={styles.arrow_flex}>
//                       <span
//                         onClick={() => {
//                           incCount();
//                         }}
//                       >
//                         <Image
//                           src={mintUpimg}
//                           alt="up"
//                           width={20}
//                           height={20}
//                         />
//                       </span>
//                       <span
//                         onClick={() => {
//                           decCount();
//                         }}
//                       >
//                         <Image
//                           src={mintDownimg}
//                           alt="down"
//                           width={20}
//                           height={20}
//                         />
//                       </span>
//                     </div>
//                     <article className={`${styles.font_style_1}`}>
//                       <span id="count">{showNum ? showNum : "0"}</span>{" "}
//                       <span
//                         className={styles.mint_btn}
//                         onClick={() => {
//                           mintNow();
//                         }}
//                       >
//                         MINT NOW
//                       </span>{" "}
//                       0.24 ETH
//                     </article>
//                   </div>
//                   <div>
//                     <article className={`${styles.font_style_1}`}>
//                       37 / 4200 AVAILABLE
//                     </article>
//                   </div>
//                 </>
//               ) : (
//                 <article className={`${styles.font_style_1}`}>
//                   SOON... FEW..
//                 </article>
//               )}
//             </div>
//           </div>
//           <div className={styles.pdrive_page_bottom}>
//             <div className={styles.pdrive_page_sound}>
//               <audio id="audio" preload="auto" loop>
//                 <source
//                   src="https://www.unikwan.com/projects/2023/pepe-drive/pepe_drip.mp3"
//                   type="audio/mp3"
//                 />
//                 Your browser does not support the audio element.
//               </audio>
//               <span
//                 onClick={(e) => {
//                   e.preventDefault();
//                   togglePlay();
//                 }}
//               >
//                 <Image
//                   src={showSound == true ? soundOn : soundOff}
//                   alt="Logo"
//                   width={80}
//                   height={80}
//                 />
//               </span>
//             </div>
//             <div className={styles.pdrive_mint_status}>
//               {showConnection == "minting" ? (
//                 <article
//                   className={`${styles.mint_status_text} ${styles.font_style_1}`}
//                 >
//                   MINTING...
//                 </article>
//               ) : showConnection == "minted" ? (
//                 <article
//                   className={`${styles.mint_status_text} ${styles.font_style_1}`}
//                 >
//                   MINTED
//                 </article>
//               ) : showConnection == "connecting" ? (
//                 <article
//                   className={`${styles.mint_status_text} ${styles.font_style_1}`}
//                 >
//                   CONNECTING...
//                 </article>
//               ) : showConnection == "connected" ? (
//                 <article
//                   className={`${styles.mint_status_text} ${styles.font_style_1}`}
//                 >
//                   CONNECTED
//                 </article>
//               ) : (
//                 <article
//                   className={`${styles.mint_status_text} ${styles.font_style_1}`}
//                 >
//                   X DAYS TO MINT
//                 </article>
//               )}
//               <ProgressBar
//                 className={"progressbar_border"}
//                 barContainerClassName={
//                   showConnection == "connected" || showConnection == "minted"
//                     ? "progressbar_inner_bg"
//                     : "progressbar_width"
//                 }
//                 completed={
//                   showConnection == "connecting" || showConnection == "minting"
//                     ? 100
//                     : showConnection == "connected" ||
//                       showConnection == "minted"
//                     ? 0
//                     : 0
//                 }
//                 transitionDuration={
//                   showConnection == "connected" || showConnection == "minted"
//                     ? "0s"
//                     : "2s"
//                 }
//                 bgColor={"#70B959"}
//                 borderRadius={"0"}
//                 isLabelVisible={false}
//               />
//             </div>
//             <div className={styles.pdrive_page_social}>
//               <Link target="_blank" href="https://twitter.com/">
//                 <Image src={twitterLogo} alt="Logo" width={80} height={80} />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }
