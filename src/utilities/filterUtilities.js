import { flattenArray } from "./arrayUtilities"
import { sizeSubCodeOrder } from "./config"

export const combinedFilter = (filterHandler, ...secondaryValues) => 
    value => 
        secondaryValues.map(secondaryValue => filterHandler(value, secondaryValue))

export const combinedSizeCode = sizeCodeMap => {
    let combined

    if (sizeCodeMap['sizeSubCode']) {
        combined = sizeCodeMap['sizeCode'].map(sizeCode =>
            sizeCodeMap['sizeSubCode'].map(
                sizeSubCode => `${sizeCode}-${sizeSubCode}`
            )
        )
    } else if (sizeCodeMap['sizeCode']) {
        combined = sizeCodeMap['sizeCode'].map(
            combinedFilter(
                (value, subValue) => `${value}-${subValue}`,
                ...sizeSubCodeOrder
            )
        )
    }

    return !!combined ? flattenArray(combined) : combined
}
