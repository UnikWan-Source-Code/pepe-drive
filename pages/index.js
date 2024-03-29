import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import styles from "../styles/Home.module.css";
import mainLogo from "../public/images/pdrive-main-logo.png";
import mainLogoM from "../public/images/pdrive-main-logo-m.png";
import eyeShut from "../public/images/eye-shut.svg";
import eyeOpen from "../public/images/eye-open.svg";

export default function Home() {
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("TRY AGAIN!");

  const [viewPwd, setViewPwd] = useState(false);
  const [allow, setAllow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setAllow(true);
  }, [passcode]);

  const handleLogin = () => {
    const errorsList = [
      "WRONG CODE, PEPE!",
      "NOPE!",
      "NOT YOUR CATS NAME!",
      "GOOD TRY, BUT NO!",
      "TRY AGAIN!",
      "ALMOST.. NAH KIDDING, DEFO NOT RIGHT!",
      "YEAH, NAH!",
      "YOUR PASSING WORD IS NOT CORRECT SIR!",
      "NO!",
      "COMPUTER SAYS NO!",
      "ACCESS TO PEPEDRIVE NOT GRANTED!",
      "WHAT IS WRONG IN FRENCH?",
      "HELL NO!",
      "WRONG PASSCODE!",
    ];
    var tempErrorMsg =
      errorsList[Math.floor(Math.random() * errorsList.length)];
    if (
      passcode != "" &&
      (passcode === "rosebud" ||
        passcode === "delta9" ||
        passcode === "sunflare")
    ) {
      // router.push("/dashboard");
      setAllow(true);
      router.push("/dashboard");
    } else {
      setErrorMsg(tempErrorMsg);
      setAllow(false);
    }
  };

  return (
    <>
      <Head>
        <title>Pepe Drive Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main className={styles.pdrive_landing_page}>
        <div className={styles.pdrive_hero_section}>
          <div className={styles.pdrive_page_top}></div>
          <div className={styles.pdrive_page_body}>
            <span className={styles.showindesktop_f}>
              <Image
                className={styles.main_logo_pepe}
                src={mainLogo}
                alt="Logo"
              />
            </span>
            <span className={styles.showinmobile_f}>
              <Image
                className={styles.main_logo_pepe}
                src={mainLogoM}
                alt="Logo"
              />
            </span>

            <div className={styles.pdrive_mint_steps}>
              <article className={`${styles.font_style_1}`}>
                ENTER PASSCODE
              </article>
              <div className={styles.login_input_box}>
                <div className={styles.login_input_hold}>
                  <input
                    onChange={(e) => setPasscode(e.target.value)}
                    type={viewPwd ? "text" : "password"}
                    maxLength="12"
                    className={`${styles.login_input_elemnt} ${styles.font_style_1}`}
                  />
                  <Image
                    className={`${styles.eye_icon_size} ${styles.cursor}`}
                    onClick={() => {
                      setViewPwd(!viewPwd);
                    }}
                    src={viewPwd ? eyeShut : eyeOpen}
                    alt="eye"
                    width="30px"
                    height="15px"
                  />
                </div>
              </div>

              <div style={{ minHeight: "45px" }}>
                {allow ? (
                  <div
                    onClick={() => handleLogin()}
                    className={`${styles.mint_btn} ${styles.enter_btn}`}
                  >
                    ENTER
                  </div>
                ) : (
                  <article
                    className={`${styles.font_style_1}`}
                    style={{ color: "#FF8059" }}
                  >
                    {errorMsg}
                  </article>
                )}
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </main>
    </>
  );
}
