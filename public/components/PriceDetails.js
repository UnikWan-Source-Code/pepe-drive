export default function PriceDetails() {
    return (
        <article className={`${styles.cnt_walet_dtails} ${styles.font_style_1}`}>
            ETH: {showWallet ? '$1689' : '$0000'} | GAS: {showWallet ? '34' : '00'} GWEI
        </article>
    )
} 