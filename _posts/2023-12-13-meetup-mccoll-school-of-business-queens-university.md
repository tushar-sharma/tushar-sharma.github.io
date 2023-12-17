---
layout: post
title: Meetup at McColl School of Business at Queens University
image: https://drive.google.com/uc?export=view&id=1qhnpHMoI-CG9mdRkK8yq509c8iChU1xW
thumb: https://drive.google.com/uc?export=view&id=1qhnpHMoI-CG9mdRkK8yq509c8iChU1xW
author: Tushar Sharma
category: blog
published: true
tags:
  - charlotte
  - finance
  - python
---

I went to Charlotte Fintech Meetup. It was held in Room 326 of Sykes Hall, which is located in the McColl School of Business at Queens University. .<!-- truncate_here -->

I went to Charlotte Fintech Meetup. It was held in Room 326 of Sykes Hall, which is located in the McColl School of Business at Queens University. 

| <img align="center"  loading="lazy" src="https://drive.google.com/uc?export=view&id=1qhnpHMoI-CG9mdRkK8yq509c8iChU1xW" alt="Sample Image" />|

### Fama-French Three-Factor Model

The Fama-French Model is an expansion of the Capital Asset Pricing Model (CAPM). It adds two additional factors to the market risk factor in CAPM. The model is often used to explain the performance of stock portfolios by examining how portfolios with different characteristics perform relative to risk factors. If a portfolio consistently invests in a small-cap or value stocks, it may have a positive SMB or HML factor, indicating that it's positioned to potentially benefit from the higher returns associated with these factors.


#### Size Factor (SMB: Small Minus Big)

SMB stands for "Small Minus Big" and is one of the three factors in the Fama-Fench three-factor model. It represents the excess return of small-cap stocks over large-cap stocks. 

The idea behind SMB is that small-cap stocks (with a small market capitalization) tends to have higher risk and potentially higher return to compensate for that risk. Over time, historically, small cap stocks have outperformed large-cap stocks on average.

#### Value Factor (HML: High Minus Low)

HML stands for "High Minus Low" and represents the excess retrun of value stock (with high book-to-market ratios) over growth stocks (with low book to market ratios).

Value stocks are typically companies that are considered undervalued relative to their fundamental value as indicated by their financial statements. Growth stocks are companies that might not be undervalued but are expected to grow at an above-average rate compared to other companies. Historically, value stocks have outperformed growth stocks, which is what HML seek to capture.


###  Markowitz Modern Portfolio Theory (MPT)

Developed by Harry Markowitz in the 1950s, MPT is a framework for assembling a portfolio of assets such that the expected return is maximized for a given level of risk. It relies on diversification to reduce the risk.

### Return of a Financial Asset (R)
The return of an asset from time t-1 to t is calculated as:

```
Return (R) = (Price at time t / Price at time t-1) - 1
```

This formula gives us the percentage change in the asset's price.

### Time Periods

In financial analysis, time periods are crucial. They can be days, months, years, or any other interval used to measure performance.

### R-squared (R^2)

R-squared is a statistical measure in a regression model that determines the proportion of the variance in the dependent variable that is predictable from the independent variable(s).

Formula: `R^2 = 1 - (Unexplained Variance / Total Variance)`

### Beta Coefficients (β)

Beta is a measure of the volatility, or systematic risk, of a security or a portfolio in comparison to the market as a whole. It is used in the CAPM.

Formula: `β = Covariance(Return of Asset, Return of Market) / Variance(Return of Market)`

### Example in Python

```python
import yfinance as yf
import numpy as np

# Fetch historical data for a stock (e.g., Apple Inc.)
data = yf.download('AAPL', start='2020-01-01', end='2020-12-31')

# Calculate daily returns
data['Return'] = data['Adj Close'].pct_change()

# Calculate R-squared and Beta for Apple Inc. against S&P 500
market_data = yf.download('^GSPC', start='2020-01-01', end='2020-12-31')
market_data['Return'] = market_data['Adj Close'].pct_change()

# Drop the NaN values that are a result of the percentage change calculation
asset_returns = data['Return'].dropna()
market_returns = market_data['Return'].dropna()

# Ensure that both series have the same length
min_length = min(len(asset_returns), len(market_returns))
asset_returns = asset_returns[-min_length:]
market_returns = market_returns[-min_length:]

# Calculate beta
covariance = np.cov(asset_returns, market_returns)[0, 1]
variance_market = np.var(market_returns)
beta = covariance / variance_market

# Print the beta coefficient
print(f"The beta of the asset is: {beta}")

# Calculate and print R-squared
correlation_matrix = np.corrcoef(asset_returns, market_returns)
correlation_xy = correlation_matrix[0,1]
r_squared = correlation_xy**2
print(f"The R-squared value is: {r_squared}")
```