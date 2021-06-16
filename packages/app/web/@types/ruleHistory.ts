export type TRuleItem = {
    fileName?:string,
    startTime?:string,
    endTime?:string,
    dStartTime?:string,
    dEndTime?:string,
    ruleType?:number,
    id?:number,
    filePath?:string|any,
    status:number
}

export type TRuleHistoryData = {
    code:number,
    message:string,
    list:[TRuleItem]
}
