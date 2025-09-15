import { ObjectId } from "mongodb"
import { getDB } from "../utils/database.js"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const db = getDB()
    const products = db.collection("products")
    const markets = db.collection("markets")
    const priceHistory = db.collection("price_history")

    const { product, market, quantity, predictionDays = 7 } = req.body

    if (!product || !market || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid input parameters" })
    }

    console.log(`[v0] Processing price prediction for ${quantity}kg of ${product} in market ${market}`)

    const currentProduct = await products.findOne({
      name: product,
      marketId: new ObjectId(market),
    })

    if (!currentProduct) {
      console.log(`[v0] Product ${product} not found in market ${market}`)
      return res.status(404).json({ message: "Product not found in selected market" })
    }

    // Get market information for location-based pricing
    const marketInfo = await markets.findOne({ _id: new ObjectId(market) })

    const historicalPrices = await priceHistory
      .find({
        productName: product,
        marketId: new ObjectId(market),
      })
      .sort({ date: -1 })
      .limit(30)
      .toArray()

    console.log(`[v0] Found ${historicalPrices.length} historical price records`)

    const prediction = await generateKgBasedPricePrediction(
      currentProduct,
      quantity,
      predictionDays,
      marketInfo,
      historicalPrices,
      db,
    )

    console.log(
      `[v0] Generated prediction for ${quantity}kg: selling=${prediction.sellingPrice}, buying=${prediction.buyingPrice}`,
    )

    res.status(200).json(prediction)
  } catch (error) {
    console.error("Price prediction error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

async function generateKgBasedPricePrediction(product, quantityKg, predictionDays, marketInfo, historicalPrices, db) {
  // Get base prices per kg directly from database
  const baseSellingPricePerKg = product.sellingPrice || 0
  const baseBuyingPricePerKg = product.buyingPrice || 0

  console.log(`[v0] Base prices per kg: selling=${baseSellingPricePerKg}, buying=${baseBuyingPricePerKg}`)

  const quantityFactor = calculateKgBasedQuantityFactor(quantityKg, product.stock || 1000)
  const seasonalFactor = calculateSeasonalFactor()
  const marketTrendFactor = await calculateHistoricalTrend(historicalPrices, product.name, db)
  const demandSupplyFactor = calculateDemandSupplyFactor(product.stock || 1000, quantityKg)
  const timeFactor = calculateTimeFactor(predictionDays)
  const locationFactor = calculateLocationFactor(marketInfo?.location)
  const volatilityFactor = calculateVolatilityFactor(historicalPrices)

  console.log(
    `[v0] Calculated factors: quantity=${quantityFactor}, seasonal=${seasonalFactor}, trend=${marketTrendFactor}`,
  )

  const predictedSellingPricePerKg = Math.max(
    baseSellingPricePerKg *
      quantityFactor *
      seasonalFactor *
      marketTrendFactor *
      timeFactor *
      locationFactor *
      volatilityFactor,
    baseSellingPricePerKg * 0.7, // Minimum 70% of base price
  )

  const predictedBuyingPricePerKg = Math.max(
    baseBuyingPricePerKg * quantityFactor * seasonalFactor * demandSupplyFactor * timeFactor * locationFactor,
    baseBuyingPricePerKg * 0.6, // Minimum 60% of base price
  )

  const totalSellingPrice = predictedSellingPricePerKg * quantityKg
  const totalBuyingPrice = predictedBuyingPricePerKg * quantityKg
  const totalProfitPotential = totalSellingPrice - totalBuyingPrice

  const recommendation = generateKgAwareRecommendation(
    predictedSellingPricePerKg,
    predictedBuyingPricePerKg,
    baseSellingPricePerKg,
    baseBuyingPricePerKg,
    quantityKg,
    product.stock || 1000,
    predictionDays,
    totalProfitPotential,
  )

  return {
    // Total prices for the entered quantity
    sellingPrice: Math.round(totalSellingPrice * 100) / 100,
    buyingPrice: Math.round(totalBuyingPrice * 100) / 100,
    profitPotential: Math.round(totalProfitPotential * 100) / 100,

    // Per kg prices for reference
    sellingPricePerKg: Math.round(predictedSellingPricePerKg * 100) / 100,
    buyingPricePerKg: Math.round(predictedBuyingPricePerKg * 100) / 100,

    // Additional insights
    bestSellTime: getBestTradingTime("sell", marketTrendFactor, predictionDays, quantityKg),
    bestBuyTime: getBestTradingTime("buy", demandSupplyFactor, predictionDays, quantityKg),
    recommendation,
    confidence: calculateConfidence(
      quantityFactor,
      seasonalFactor,
      marketTrendFactor,
      timeFactor,
      historicalPrices.length,
    ),

    // Detailed breakdown
    factors: {
      quantity: Math.round(quantityFactor * 1000) / 1000,
      seasonal: Math.round(seasonalFactor * 1000) / 1000,
      marketTrend: Math.round(marketTrendFactor * 1000) / 1000,
      demandSupply: Math.round(demandSupplyFactor * 1000) / 1000,
      time: Math.round(timeFactor * 1000) / 1000,
      location: Math.round(locationFactor * 1000) / 1000,
      volatility: Math.round(volatilityFactor * 1000) / 1000,
    },

    predictionPeriod: predictionDays,
    totalQuantity: quantityKg,
    baseSellingPricePerKg: baseSellingPricePerKg,
    baseBuyingPricePerKg: baseBuyingPricePerKg,
  }
}

function calculateKgBasedQuantityFactor(quantityKg, availableStockKg) {
  const stockRatio = quantityKg / availableStockKg

  // Bulk pricing tiers based on kg quantities
  if (quantityKg >= 10000) return 0.8 // 20% discount for very large bulk (10+ tons)
  if (quantityKg >= 5000) return 0.85 // 15% discount for large bulk (5+ tons)
  if (quantityKg >= 2000) return 0.9 // 10% discount for medium bulk (2+ tons)
  if (quantityKg >= 1000) return 0.93 // 7% discount for bulk (1+ ton)
  if (quantityKg >= 500) return 0.95 // 5% discount for semi-bulk
  if (quantityKg >= 100) return 0.97 // 3% discount for small bulk
  if (quantityKg >= 50) return 0.99 // 1% discount for moderate quantities

  // Small quantity premiums
  if (quantityKg < 5) return 1.15 // 15% premium for very small quantities
  if (quantityKg < 10) return 1.1 // 10% premium for small quantities
  if (quantityKg < 25) return 1.05 // 5% premium for below-average quantities

  // Stock scarcity factor
  if (stockRatio > 0.8) return 1.2 // 20% premium when stock is very low
  if (stockRatio > 0.6) return 1.1 // 10% premium when stock is low
  if (stockRatio > 0.4) return 1.05 // 5% premium when stock is moderate

  return 1.0 // Standard pricing
}

async function calculateHistoricalTrend(historicalPrices, productName, db) {
  if (historicalPrices.length < 3) {
    console.log(`[v0] Insufficient historical data for ${productName}, using default trend`)
    return 1.0
  }

  // Calculate price trend over last 30 days
  const recent = historicalPrices.slice(0, 7) // Last 7 records
  const older = historicalPrices.slice(7, 14) // Previous 7 records

  if (recent.length === 0 || older.length === 0) return 1.0

  const recentAvg = recent.reduce((sum, p) => sum + (p.sellingPrice || 0), 0) / recent.length
  const olderAvg = older.reduce((sum, p) => sum + (p.sellingPrice || 0), 0) / older.length

  if (olderAvg === 0) return 1.0

  const trendRatio = recentAvg / olderAvg
  console.log(`[v0] Historical trend ratio: ${trendRatio} (recent: ${recentAvg}, older: ${olderAvg})`)

  // Convert trend ratio to factor
  if (trendRatio > 1.15) return 1.1 // Strong upward trend
  if (trendRatio > 1.05) return 1.05 // Moderate upward trend
  if (trendRatio < 0.85) return 0.9 // Strong downward trend
  if (trendRatio < 0.95) return 0.95 // Moderate downward trend

  return 1.0 // Stable trend
}

function calculateVolatilityFactor(historicalPrices) {
  if (historicalPrices.length < 5) return 1.0

  const prices = historicalPrices.slice(0, 10).map((p) => p.sellingPrice || 0)
  const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length

  if (avgPrice === 0) return 1.0

  // Calculate standard deviation
  const variance = prices.reduce((sum, p) => sum + Math.pow(p - avgPrice, 2), 0) / prices.length
  const stdDev = Math.sqrt(variance)
  const volatility = stdDev / avgPrice

  // Higher volatility = higher risk premium
  if (volatility > 0.2) return 1.08 // High volatility
  if (volatility > 0.1) return 1.04 // Medium volatility
  if (volatility < 0.05) return 0.98 // Low volatility (stable market)

  return 1.0
}

function calculateSeasonalFactor() {
  const month = new Date().getMonth()
  // Simulate seasonal price variations
  const seasonalFactors = [1.1, 1.05, 1.0, 0.95, 0.9, 0.85, 0.9, 0.95, 1.0, 1.05, 1.1, 1.15]
  return seasonalFactors[month]
}

function calculateDemandSupplyFactor(stockKg, requestedQuantityKg) {
  const ratio = requestedQuantityKg / stockKg
  if (ratio > 0.8) return 1.1 // High demand, low supply
  if (ratio > 0.5) return 1.05 // Medium demand
  if (ratio < 0.1) return 0.95 // Low demand, high supply
  return 1.0
}

function calculateTimeFactor(predictionDays) {
  // Longer predictions are less certain and may have higher volatility
  if (predictionDays <= 1) return 1.0
  if (predictionDays <= 7) return 1.02
  if (predictionDays <= 14) return 1.05
  if (predictionDays <= 30) return 1.08
  return 1.1
}

function calculateLocationFactor(location) {
  if (!location) return 1.0

  // Simulate regional price variations (this would be enhanced with real data)
  const locationFactors = {
    kampala: 1.1,
    entebbe: 1.05,
    jinja: 1.02,
    mbarara: 0.98,
    gulu: 0.95,
    arua: 0.93,
  }

  const locationKey = location.toLowerCase()
  return locationFactors[locationKey] || 1.0
}

function generateKgAwareRecommendation(
  predictedSellPerKg,
  predictedBuyPerKg,
  currentSellPerKg,
  currentBuyPerKg,
  quantityKg,
  stockKg,
  predictionDays,
  totalProfit,
) {
  const sellDiff = ((predictedSellPerKg - currentSellPerKg) / currentSellPerKg) * 100
  const buyDiff = ((predictedBuyPerKg - currentBuyPerKg) / currentBuyPerKg) * 100
  const stockRatio = quantityKg / stockKg
  const profitPerKg = totalProfit / quantityKg

  // Quantity-specific recommendations
  if (quantityKg >= 5000) {
    if (sellDiff > 8) {
      return `Excellent bulk opportunity! For your ${quantityKg.toLocaleString()}kg bulk order, waiting could increase profits by ${sellDiff.toFixed(1)}%. Total potential profit: ${totalProfit.toLocaleString()} UGX.`
    }
    return `Large bulk transaction (${quantityKg.toLocaleString()}kg). Current market conditions offer ${profitPerKg.toFixed(0)} UGX profit per kg. Consider negotiating volume discounts.`
  }

  if (quantityKg >= 1000) {
    if (sellDiff > 5) {
      return `Good timing for your ${quantityKg.toLocaleString()}kg order! Predicted price increase of ${sellDiff.toFixed(1)}% could boost your profits significantly.`
    }
    return `Medium bulk order (${quantityKg.toLocaleString()}kg). Market is stable with ${profitPerKg.toFixed(0)} UGX profit potential per kg.`
  }

  if (quantityKg < 50) {
    if (sellDiff > 10) {
      return `Despite small quantity (${quantityKg}kg), waiting ${predictionDays} days could increase value by ${sellDiff.toFixed(1)}%. Small quantities often get premium prices.`
    }
    if (buyDiff < -5) {
      return `Good buying opportunity for ${quantityKg}kg! Prices may drop ${Math.abs(buyDiff).toFixed(1)}%, making this an ideal time to purchase.`
    }
    return `Small quantity (${quantityKg}kg) trading. Current market offers fair pricing with ${profitPerKg.toFixed(0)} UGX profit per kg.`
  }

  // Standard recommendations
  if (sellDiff > 12) {
    return `Excellent selling opportunity! Predicted ${sellDiff.toFixed(1)}% price increase for ${quantityKg}kg could generate ${totalProfit.toLocaleString()} UGX profit.`
  } else if (sellDiff > 6) {
    return `Good time to sell ${quantityKg}kg! Expected ${sellDiff.toFixed(1)}% price increase over ${predictionDays} days.`
  } else if (sellDiff < -8) {
    return `Consider selling ${quantityKg}kg now! Prices may drop ${Math.abs(sellDiff).toFixed(1)}% in the coming days.`
  } else if (buyDiff < -6) {
    return `Great buying opportunity for ${quantityKg}kg! Predicted price drop of ${Math.abs(buyDiff).toFixed(1)}% makes this ideal timing.`
  } else if (stockRatio > 0.7) {
    return `High demand for ${quantityKg}kg detected! Limited supply (${(stockRatio * 100).toFixed(1)}% of available stock) may drive prices up.`
  }

  return `Market conditions are stable for ${quantityKg}kg. Current pricing offers ${profitPerKg.toFixed(0)} UGX profit per kg over ${predictionDays} days.`
}

function getBestTradingTime(action, factor, predictionDays, quantityKg) {
  const bulkSuffix = quantityKg >= 1000 ? " (bulk order benefits)" : quantityKg < 50 ? " (small quantity premium)" : ""

  if (action === "sell") {
    if (factor > 1.08) return `Immediate - Next 1-2 days${bulkSuffix}`
    if (factor > 1.04) return `Within ${Math.min(predictionDays, 5)} days${bulkSuffix}`
    if (factor > 1.02) return `Within ${Math.min(predictionDays, 10)} days${bulkSuffix}`
    return `Wait ${predictionDays + 2}-${predictionDays + 7} days for better prices${bulkSuffix}`
  } else {
    if (factor < 0.92) return `Excellent buying window - Next 1-3 days${bulkSuffix}`
    if (factor < 0.96) return `Good buying opportunity - Within ${Math.min(predictionDays, 7)} days${bulkSuffix}`
    if (factor < 0.98) return `Consider buying within ${predictionDays} days${bulkSuffix}`
    return `Wait for market correction - ${predictionDays + 5} days${bulkSuffix}`
  }
}

function calculateConfidence(quantityFactor, seasonalFactor, marketTrendFactor, timeFactor, historicalDataPoints) {
  const baseConfidence = 0.75

  // Factor variance (how much factors deviate from 1.0)
  const factorVariance =
    Math.abs(1 - quantityFactor) +
    Math.abs(1 - seasonalFactor) +
    Math.abs(1 - marketTrendFactor) +
    Math.abs(1 - timeFactor)

  // Historical data bonus
  const dataBonus = Math.min(0.15, historicalDataPoints * 0.01)

  // Time penalty (longer predictions are less certain)
  const timePenalty = timeFactor > 1.05 ? 0.1 : 0

  const confidence = baseConfidence + dataBonus - factorVariance * 0.08 - timePenalty

  return Math.max(0.5, Math.min(0.95, confidence))
}
