async function generateLast12MonthData(model) {
  const last12Month = [];

  // Get the current date and start from the next day
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);

  for (let i = 11; i >= 0; i--) {
    // Calculate the end date of the current month
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - i * 28
    );

    // Calculate the start date of the current month
    const startDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate() - 28
    );

    // Format the month and year
    const monthYear = endDate.toLocaleString("default", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    // Count the documents created within the current month
    const count = await model.countDocuments({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    // Store the data for the current month in the result array
    last12Month.push({ month: monthYear, count: count });
  }

  return { last12Month };
}

module.exports = generateLast12MonthData;
