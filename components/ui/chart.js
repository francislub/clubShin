// Chart.js wrapper for compatibility with existing JavaScript code
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
  } from "chart.js"
  
  // Register Chart.js components
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
  )
  
  // Export Chart.js as named export for compatibility
  export { ChartJS as Chart }
  
  // Default export for convenience
  export default ChartJS
  