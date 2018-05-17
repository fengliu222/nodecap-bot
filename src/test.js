const { generateReport } = require('./handler/report')
const { generateWeeklyReport } = require('./handler/report/weekly')
const { handleInvestmentQuery } = require('./handler/chat/investment')

// generateReport()
// generateWeeklyReport()
handleInvestmentQuery()
