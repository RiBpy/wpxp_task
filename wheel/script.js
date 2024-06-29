document.addEventListener("DOMContentLoaded", () => {
  // Get references to the DOM elements
  const wheel = document.getElementById("spinner-wheel");
  const spinBtn = document.getElementById("spinner-btn");
  const closeBtn = document.getElementById("spinner-close");
  const addBtn = document.getElementById("names-add-btn");
  const textBox = document.getElementById("names-input-box");
  const showResult = document.getElementById("spinner-result");

  // Initial names and colors for the wheel
  const initialNames = ["Ibrahim", "Jasim", "Jisan", "Teebro", "Rifat"];
  const initialColors = ["#EF4639", "#7C25A1", "#FAD538", "#0A9BE1", "#67B56B"];
  
  // Chart.js options
  const options = {
    responsive: true,
    cutout: 20,
    animation: false,
    plugins: {
      labels: {
        render: "label",
        fontColor: "#fff",
        fontSize: 24,
      },
      legend: { display: false },
      tooltip: false,
    },
    datalabels: {
      color: "#ffffff",
      formatter: (_, context) => context.chart.data.labels[context.dataIndex],
      font: { size: 24 },
    },
  };

  // Initialize the chart
  let chart = new Chart(wheel, {
    type: "pie",
    data: {
      labels: initialNames,
      datasets: [
        {
          label: "Wheel",
          data: [1, 1, 1, 1, 1],
          backgroundColor: initialColors,
        },
      ],
    },
    options,
  });

  // Create an array with information about each segment of the wheel
  let infoArray = initialNames.map((name, index) => ({
    name,
    minValue: index * 72,
    maxValue: (index + 1) * 72,
    color: initialColors[index],
  }));

  // Function to generate a random color
  const getRandomColor = () =>
    "#" + Math.floor(Math.random() * 16777215).toString(16);

  // Function to normalize angle to 0-359 degrees
  const normAngelDeg = (angle) => angle % 360;

  // Event listener for the close button to hide the result
  closeBtn.addEventListener("click", () => {
    showResult.style.display = "none";
    closeBtn.style.display = "none";
  });

  // Event listener for the add button to add new names to the wheel
  addBtn.addEventListener("click", () => {
    const names = textBox.value.trim().split("\n").filter(name => name.trim() !== "");

    // If no new names are added, return without updating the wheel
    if (names.length === 0) {
      return;
    }

    // Clear the input box
    textBox.value = "";
    const dataArray = Array(names.length).fill(1);
    const colorsArray = names.map(getRandomColor);
    const pieAngle = 360 / dataArray.length;

    // Update infoArray with new names and their corresponding angles
    infoArray = names.map((name, index) => ({
      name,
      minValue: index * pieAngle,
      maxValue: (index + 1) * pieAngle,
      color: colorsArray[index],
    }));

    // Update the chart data
    const data = {
      labels: names,
      datasets: [
        { label: "Wheel", data: dataArray, backgroundColor: colorsArray },
      ],
    };

    // Destroy the old chart and create a new one with the updated data
    chart.destroy();
    chart = new Chart(wheel, { type: "pie", data, options });
  });

  // Function to find the result based on the angle
  const resultFinder = (angle) => {
    // Normalize angle to be within 0-359 degrees
    angle = normAngelDeg(angle);

    // Find the winning segment based on the angle
    for (let item of infoArray) {
      if (angle >= item.minValue && angle < item.maxValue) {
        showResult.style.display = "flex";
        closeBtn.style.display = "flex";
        showResult.innerHTML = `${item.name} is Winner!`;
        break;
      }
    }

    // Update the angles for the next spin
    infoArray.forEach((item) => {
      item.minValue = normAngelDeg(item.minValue + angle);
      item.maxValue = normAngelDeg(item.maxValue + angle);
    });
  };

  // Event listener for the spin button to spin the wheel
  spinBtn.addEventListener("click", () => {
    spinBtn.disabled = true;
    closeBtn.style.display = "none";
    showResult.style.display = "none";

    // Random angle to stop the wheel at
    let angle = Math.floor(Math.random() * 360);
    let currentRotation = normAngelDeg(chart.options.rotation);
    let rotationCount = 0;
    const maxCount = Math.floor(Math.random() * 5 + 5);

    // Calculate the final angle to place the winner at the right
    const finalAngle = normAngelDeg(angle + 90);

    // Interval to animate the spinning
    const rotationInterval = setInterval(() => {
      chart.options.rotation += 64 / (rotationCount + 1);
      currentRotation += 64 / (rotationCount + 1);
      chart.update();

      // Reset rotation if it goes over 360 degrees
      if (chart.options.rotation >= 360) {
        rotationCount++;
        chart.options.rotation -= 360;
        currentRotation -= 360;
      }

      // Stop spinning when the wheel reaches the desired angle
      if (rotationCount >= maxCount && currentRotation >= angle) {
        resultFinder(finalAngle);
        spinBtn.disabled = false;
        clearInterval(rotationInterval);
      }
    }, 20);
  });
});
