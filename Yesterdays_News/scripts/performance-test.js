#!/usr/bin/env node

/**
 * Performance Testing Script
 * Measures app startup time and memory usage
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class PerformanceTester {
  constructor() {
    this.results = {
      startup: [],
      memory: [],
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Run performance tests
   */
  async runTests() {
    console.log('🚀 Starting Performance Tests...\n');

    try {
      // Test 1: Cold Start (app not in memory)
      console.log('📱 Testing Cold Start...');
      await this.testColdStart();

      // Test 2: Warm Start (app in background)
      console.log('📱 Testing Warm Start...');
      await this.testWarmStart();

      // Test 3: Memory Usage
      console.log('📱 Testing Memory Usage...');
      await this.testMemoryUsage();

      // Generate report
      this.generateReport();

    } catch (error) {
      console.error('❌ Performance test failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Test cold start performance
   */
  async testColdStart() {
    const iterations = 5;
    const times = [];

    for (let i = 0; i < iterations; i++) {
      console.log(`  Iteration ${i + 1}/${iterations}...`);
      
      // Force stop app
      this.forceStopApp();
      
      // Wait a bit
      await this.sleep(2000);
      
      // Start app and measure time
      const startTime = Date.now();
      this.startApp();
      
      // Wait for app to be fully loaded (check for main activity)
      await this.waitForAppLoad();
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      times.push(duration);
      console.log(`    Cold start: ${duration}ms`);
      
      // Wait between iterations
      await this.sleep(3000);
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);

    this.results.startup.push({
      type: 'cold',
      times: times,
      average: avgTime,
      min: minTime,
      max: maxTime,
      iterations: iterations
    });

    console.log(`  ✅ Cold Start Average: ${avgTime.toFixed(0)}ms (${minTime}-${maxTime}ms)\n`);
  }

  /**
   * Test warm start performance
   */
  async testWarmStart() {
    const iterations = 3;
    const times = [];

    for (let i = 0; i < iterations; i++) {
      console.log(`  Iteration ${i + 1}/${iterations}...`);
      
      // Put app in background
      this.putAppInBackground();
      await this.sleep(1000);
      
      // Bring app to foreground
      const startTime = Date.now();
      this.bringAppToForeground();
      
      // Wait for app to be responsive
      await this.waitForAppLoad();
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      times.push(duration);
      console.log(`    Warm start: ${duration}ms`);
      
      await this.sleep(2000);
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);

    this.results.startup.push({
      type: 'warm',
      times: times,
      average: avgTime,
      min: minTime,
      max: maxTime,
      iterations: iterations
    });

    console.log(`  ✅ Warm Start Average: ${avgTime.toFixed(0)}ms (${minTime}-${maxTime}ms)\n`);
  }

  /**
   * Test memory usage
   */
  async testMemoryUsage() {
    const iterations = 3;
    const memoryReadings = [];

    for (let i = 0; i < iterations; i++) {
      console.log(`  Iteration ${i + 1}/${iterations}...`);
      
      // Get memory usage
      const memory = this.getMemoryUsage();
      memoryReadings.push(memory);
      
      console.log(`    Memory: ${memory.total}MB (${memory.used}MB used)`);
      
      await this.sleep(2000);
    }

    this.results.memory = memoryReadings;
    console.log(`  ✅ Memory Usage: ${memoryReadings[0].used}MB average\n`);
  }

  /**
   * Force stop the app
   */
  forceStopApp() {
    try {
      execSync('adb shell am force-stop com.mardin.yesterdaysnews', { stdio: 'pipe' });
    } catch (error) {
      console.warn('  Warning: Could not force stop app:', error.message);
    }
  }

  /**
   * Start the app
   */
  startApp() {
    try {
      execSync('adb shell am start -n com.mardin.yesterdaysnews/.MainActivity', { stdio: 'pipe' });
    } catch (error) {
      throw new Error(`Failed to start app: ${error.message}`);
    }
  }

  /**
   * Put app in background
   */
  putAppInBackground() {
    try {
      execSync('adb shell input keyevent KEYCODE_HOME', { stdio: 'pipe' });
    } catch (error) {
      console.warn('  Warning: Could not put app in background:', error.message);
    }
  }

  /**
   * Bring app to foreground
   */
  bringAppToForeground() {
    try {
      execSync('adb shell am start -n com.mardin.yesterdaysnews/.MainActivity', { stdio: 'pipe' });
    } catch (error) {
      throw new Error(`Failed to bring app to foreground: ${error.message}`);
    }
  }

  /**
   * Wait for app to load
   */
  async waitForAppLoad() {
    const maxWait = 10000; // 10 seconds
    const checkInterval = 500; // 500ms
    let waited = 0;

    while (waited < maxWait) {
      try {
        // Check if main activity is running
        const result = execSync('adb shell dumpsys activity activities | grep com.mardin.yesterdaysnews', { 
          stdio: 'pipe',
          encoding: 'utf8'
        });
        
        if (result.includes('MainActivity') && result.includes('RESUMED')) {
          return;
        }
      } catch (error) {
        // Activity not found yet, continue waiting
      }
      
      await this.sleep(checkInterval);
      waited += checkInterval;
    }
    
    throw new Error('App did not load within timeout period');
  }

  /**
   * Get memory usage
   */
  getMemoryUsage() {
    try {
      const result = execSync('adb shell dumpsys meminfo com.mardin.yesterdaysnews', { 
        stdio: 'pipe',
        encoding: 'utf8'
      });
      
      // Parse memory info
      const lines = result.split('\n');
      let totalPss = 0;
      let usedPss = 0;
      
      for (const line of lines) {
        if (line.includes('TOTAL PSS')) {
          const match = line.match(/(\d+)/);
          if (match) {
            totalPss = parseInt(match[1]);
          }
        }
        if (line.includes('TOTAL')) {
          const match = line.match(/(\d+)/);
          if (match) {
            usedPss = parseInt(match[1]);
          }
        }
      }
      
      return {
        total: Math.round(totalPss / 1024), // Convert KB to MB
        used: Math.round(usedPss / 1024),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.warn('  Warning: Could not get memory usage:', error.message);
      return {
        total: 0,
        used: 0,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Generate performance report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      app: 'Yesterdays News',
      version: '1.0.0',
      results: this.results,
      summary: this.generateSummary()
    };

    // Save report
    const reportPath = path.join(__dirname, '..', 'performance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Generate markdown report
    const markdownReport = this.generateMarkdownReport(report);
    const markdownPath = path.join(__dirname, '..', 'performance-report.md');
    fs.writeFileSync(markdownPath, markdownReport);

    console.log('📊 Performance Report Generated:');
    console.log(`  JSON: ${reportPath}`);
    console.log(`  Markdown: ${markdownPath}\n`);
    
    this.printSummary(report.summary);
  }

  /**
   * Generate performance summary
   */
  generateSummary() {
    const coldStart = this.results.startup.find(s => s.type === 'cold');
    const warmStart = this.results.startup.find(s => s.type === 'warm');
    const memory = this.results.memory[0];

    return {
      coldStartAverage: coldStart ? coldStart.average : 0,
      warmStartAverage: warmStart ? warmStart.average : 0,
      memoryUsage: memory ? memory.used : 0,
      performance: this.assessPerformance(coldStart, warmStart, memory)
    };
  }

  /**
   * Assess overall performance
   */
  assessPerformance(coldStart, warmStart, memory) {
    let score = 100;
    let issues = [];

    // Cold start assessment
    if (coldStart && coldStart.average > 3000) {
      score -= 20;
      issues.push('Cold start is slow (>3s)');
    }

    // Warm start assessment
    if (warmStart && warmStart.average > 1000) {
      score -= 15;
      issues.push('Warm start is slow (>1s)');
    }

    // Memory assessment
    if (memory && memory.used > 100) {
      score -= 10;
      issues.push('High memory usage (>100MB)');
    }

    let rating = 'Excellent';
    if (score < 80) rating = 'Good';
    if (score < 60) rating = 'Fair';
    if (score < 40) rating = 'Poor';

    return {
      score: score,
      rating: rating,
      issues: issues
    };
  }

  /**
   * Generate markdown report
   */
  generateMarkdownReport(report) {
    const { summary, results } = report;
    
    return `# Performance Test Report

**App:** ${report.app} v${report.version}  
**Date:** ${new Date(report.timestamp).toLocaleString()}  
**Overall Rating:** ${summary.performance.rating} (${summary.performance.score}/100)

## Summary

| Metric | Value | Status |
|--------|-------|--------|
| Cold Start | ${summary.coldStartAverage.toFixed(0)}ms | ${summary.coldStartAverage < 3000 ? '✅ Good' : '⚠️ Slow'} |
| Warm Start | ${summary.warmStartAverage.toFixed(0)}ms | ${summary.warmStartAverage < 1000 ? '✅ Good' : '⚠️ Slow'} |
| Memory Usage | ${summary.memoryUsage}MB | ${summary.memoryUsage < 100 ? '✅ Good' : '⚠️ High'} |

## Detailed Results

### Startup Times

#### Cold Start
- **Average:** ${summary.coldStartAverage.toFixed(0)}ms
- **Range:** ${results.startup[0].min}-${results.startup[0].max}ms
- **Iterations:** ${results.startup[0].iterations}

#### Warm Start  
- **Average:** ${summary.warmStartAverage.toFixed(0)}ms
- **Range:** ${results.startup[1].min}-${results.startup[1].max}ms
- **Iterations:** ${results.startup[1].iterations}

### Memory Usage
- **Average:** ${summary.memoryUsage}MB
- **Readings:** ${results.memory.length}

## Performance Issues
${summary.performance.issues.length > 0 ? summary.performance.issues.map(issue => `- ${issue}`).join('\n') : '- No issues detected'}

## Recommendations
${this.generateRecommendations(summary)}

---
*Generated by Performance Testing Script*
`;
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(summary) {
    const recommendations = [];

    if (summary.coldStartAverage > 3000) {
      recommendations.push('- Optimize app startup time by reducing initial bundle size');
      recommendations.push('- Implement lazy loading for non-critical components');
    }

    if (summary.warmStartAverage > 1000) {
      recommendations.push('- Optimize app state restoration');
      recommendations.push('- Reduce memory footprint to improve warm start');
    }

    if (summary.memoryUsage > 100) {
      recommendations.push('- Implement memory optimization strategies');
      recommendations.push('- Review image caching and component lifecycle');
    }

    if (recommendations.length === 0) {
      recommendations.push('- Performance is within acceptable ranges');
      recommendations.push('- Continue monitoring for regression');
    }

    return recommendations.join('\n');
  }

  /**
   * Print summary to console
   */
  printSummary(summary) {
    console.log('📈 Performance Summary:');
    console.log(`  Cold Start: ${summary.coldStartAverage.toFixed(0)}ms`);
    console.log(`  Warm Start: ${summary.warmStartAverage.toFixed(0)}ms`);
    console.log(`  Memory: ${summary.memoryUsage}MB`);
    console.log(`  Rating: ${summary.performance.rating} (${summary.performance.score}/100)`);
    
    if (summary.performance.issues.length > 0) {
      console.log('\n⚠️  Issues:');
      summary.performance.issues.forEach(issue => {
        console.log(`    - ${issue}`);
      });
    }
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new PerformanceTester();
  tester.runTests().catch(console.error);
}

module.exports = PerformanceTester;
