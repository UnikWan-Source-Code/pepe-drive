import Image from "next/image";
import ProgressBar from "@ramonak/react-progress-bar";
//import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import ethLogo from "../public/images/eth-logo.png";
import mainLogo from "../public/images/pdrive-main-logo.png";
import soundOn from "../public/images/sound-on.png";
import soundOff from "../public/images/sound-off.png";
import twitterLogo from "../public/images/twitter-logo.png";
import { useState } from "react";
import Link from "next/link";


//const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [showSound, setSound] = useState(false);
  const [showWallet, setWallet] = useState(false);  
  const [showMint, setMint] = useState(false);
  const [showConnection, setConnection] = useState("");
  const [showNum, setNum] = useState(0);

  const connectWallet = (e) => {
    e.preventDefault();
    setConnection("connecting");
    setTimeout(function () {
      setConnection("connected");
      setWallet(true);
    }, 2000);
  }

  const mintNow = () => {
    setConnection("minting");
    setTimeout(function () {
      setConnection("minted");
      setMint(true);
    }, 2000);
  }

  const togglePlay = () => {
    var audio = document.getElementById("audio");
    if(audio.paused) {
      setSound(true);
      audio.play();      
    }
    else {
      setSound(false);
      audio.pause();
      audio.currentTime = 0;
    }
  }

  const incCount = () => {
    var count = document.getElementById("count").innerHTML;
    if(count >= 0) {
      setNum(parseInt(count) + 1);
    }
  }

  const decCount = () => {
    var count = document.getElementById("count").innerHTML;
    if(count > 0) {
      setNum(parseInt(count) - 1);
    }
  }

  return (
    <>     
      <main className={styles.pdrive_landing_page}>
        <div className={styles.pdrive_hero_section}>
          <div className={styles.pdrive_page_top}>
            <div className={styles.pdrive_logo_box}>
              <div className={styles.pdrive_logo_img}>
                <div className={styles.pdrive_logo_src}>
                  <Image
                    src={ethLogo}
                    alt="Logo"
                    width={65}
                    height={105}
                  />
                </div>
              </div>
              <div className={styles.cnt_wallet}>
                <article className={`${styles.cnt_walet_dtails} ${styles.cnt_walet_dtails_mob} ${styles.font_style_1}`}>
                  ETH: $1689 | GAS: 34 GWAI
                </article>
                {showWallet == false
                ?
                  <a href="" onClick={(e) => {connectWallet(e)} } className={`${styles.cnt_walet_text} ${styles.font_style_1}`}>                
                    CONNECT WALLET
                  </a>
                :
                  <>
                  <article className={`${styles.cnt_walet_text} ${styles.font_style_1}`}>WALLET CONNECTED</article>
                  <article className={styles.cnt_wallet_adr}>0x29...C938</article>
                  </>
                }                
              </div>
            </div>
            <div className={`${styles.eth_details_box} ${styles.eth_details_box_desk}`}>
              <article className={`${styles.cnt_walet_dtails} ${styles.font_style_1}`}>
                ETH: $1689 | GAS: 34 GWAI
              </article>
            </div>
          </div>
          <hr className={styles.hr_line} />
          <div className={styles.pdrive_page_body}>
            <Image
              src={mainLogo}
              alt="Logo"
              width={940}
              height={260}
            />
            <div className={styles.pdrive_mint_steps}>
              {showMint == true
              ?
                <article className={`${styles.font_style_1} ${styles.extra_lh}`}>
                  YOU SUCCESSFULLY<br/>
                  MINTED X PEPE DRIVE NFTS
                </article>
              :
              showWallet == true
              ?
                <>
                <div className={`${styles.mb} ${styles.count_flex}`}>
                  <div className={styles.arrow_flex}>
                    <span onClick={() => {incCount()} }>&#8710;</span>
                    <span onClick={() => {decCount()} }>&#8711;</span>
                  </div>
                  <article className={`${styles.font_style_1}`}>
                    <span id="count">{showNum}</span>x <span className={styles.mint_btn} onClick={() => {mintNow()} }>MINT NOW</span> 0.24 ETH
                  </article>
                </div>
                <div>
                  <article className={`${styles.font_style_1}`}>
                    37 / 4200 AVAILABLE
                  </article>
                </div>
                </>                
              :
                <article className={`${styles.font_style_1}`}>
                  SOON... FEW..
                </article>
              }
            </div>
          </div>
          <div className={styles.pdrive_page_bottom}>
            <div className={styles.pdrive_page_sound}>
              <audio id="audio" src="http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3" preload="auto"></audio>
              <Link href="/" onClick={(e) => {e.preventDefault(); togglePlay()} }>
              <Image
                src={showSound == true ? soundOn : soundOff}
                alt="Logo"
                width={80}
                height={80}
              />
              </Link>
            </div>
            <div className={styles.pdrive_mint_status}>
              {showConnection == "minting"
              ?
                <article className={`${styles.mint_status_text} ${styles.font_style_1}`}>
                  MINTING...
                </article>
              :
              showConnection == "minted"
              ?
                <article className={`${styles.mint_status_text} ${styles.font_style_1}`}>
                  MINTED
                </article>
              :
              showConnection == "connecting"
              ?
                <article className={`${styles.mint_status_text} ${styles.font_style_1}`}>
                  CONNECTING...
                </article>
              :
              showConnection == "connected"
              ?
                <article className={`${styles.mint_status_text} ${styles.font_style_1}`}>
                  CONNECTED
                </article>
              :
                <article className={`${styles.mint_status_text} ${styles.font_style_1}`}>
                  X DAYS TO MINT
                </article>
              }              
              <ProgressBar className={"progressbar_border"} barContainerClassName={(showConnection == "connected" || showConnection == "minted") ? "progressbar_inner_bg" : "progressbar_width"} completed={(showConnection == "connecting" || showConnection == "minting") ? 100 : (showConnection == "connected" || showConnection == "minted") ? 0 : 0} transitionDuration={(showConnection == "connected" || showConnection == "minted") ? "0s" : "2s"} bgColor={"#70B959"} borderRadius={"0"} />
            </div>
            <div className={styles.pdrive_page_social}>
              <Link href="">
                <Image
                  src={twitterLogo}
                  alt="Logo"
                  width={80}
                  height={80}
                />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
