import styles from "../styles/Home.module.css";

const PriceDetails = (showWallet) => {
    return <>
        <article className={`${styles.font_style_1} ${styles.cnt_walet_dtails}`}>
            ETH: {showWallet ? '$1689' : '$0000'} | GAS: {showWallet ? '34' : '00'} GWEI
        </article>
    </>


}
export default PriceDetails;