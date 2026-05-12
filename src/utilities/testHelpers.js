// utilized to simulate a long API call
const stall = async (stallTime = 10000) => {
    await new Promise(resolve => setTimeout(resolve, stallTime))
}

export { stall }
