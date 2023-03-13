import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import styles from "../styles/Home.module.css";
import mainLogo from "../public/images/pdrive-main-logo.png";
import mainLogoM from "../public/images/pdrive-main-logo-m.png";

export default function Login() {
    const [passcode, setPasscode] = useState("");
    const [allow, setAllow] = useState(false);
    useEffect(() => {
        setAllow(true)

    }, [passcode])
    const router = useRouter();
    const handleLogin = () => {
        if (passcode != "") {
            router.push("/dashboard");
            setAllow(true)
        }
        else {
            setAllow(false)
        }
    };

    return (
        <>
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
                                <input
                                    onChange={(e) => setPasscode(e.target.value)}
                                    type="password"
                                    className={`${styles.login_input_elemnt} ${styles.font_style_1}`}
                                />
                            </div>

                            <div style={{ minHeight: '30px' }} >
                                {allow ?
                                    <div
                                        onClick={() => handleLogin()}
                                        className={`${styles.mint_btn} ${styles.enter_btn}`}
                                    >
                                        ENTER
                                    </div> : <article className={`${styles.font_style_1}`} style={{ color: '#FF8059' }}>
                                        COMPUTER SAYS NO!
                                    </article>}
                            </div>
                        </div>
                    </div>
                    <div></div>
                </div>
            </main>
        </>
    );
}
