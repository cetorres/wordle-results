import React, { useEffect, useState } from "react";
import { Result } from "./interfaces";
import { Chart } from "react-google-charts";

export default function Statistics(props: any) {
  const { results } = props;
  const [gamesPlayed, setGamesPlayed] = useState('0');
  const [winsPercentage, setWinsPercentage] = useState('0');
  const [numberWins, setNumberWins] = useState('0');
  const [numberLosses, setNumberLosses] = useState('0');
  const [lastDate, setLastDate] = useState('Never');
  const [chartData, setChartData] = useState<any>([]);

  function loadStatistics(savedResults: Array<Result>) {
    const total = savedResults.length;
    setGamesPlayed(total.toString());

    if (total === 0) {
      setNumberWins('0');
      setNumberLosses('0');
      setWinsPercentage('0');
      setLastDate('Never');
      setChartData([]);
      return;
    }

    const wins = savedResults.filter((r) => !r.tries.includes('X')).length;
    const losts = savedResults.filter((r) => r.tries.includes('X')).length;
    setWinsPercentage(((wins / total) * 100).toFixed(0));
    
    setNumberWins(wins.toString());
    setNumberLosses(losts.toString());

    const lastGameDate = savedResults.sort((r1, r2) => r2.number - r1.number)[0].date.split('T')[0];
    setLastDate(lastGameDate);

    const total_1_tries = savedResults.filter((r) => r.tries.includes('1/')).length;
    const total_2_tries = savedResults.filter((r) => r.tries.includes('2/')).length;
    const total_3_tries = savedResults.filter((r) => r.tries.includes('3/')).length;
    const total_4_tries = savedResults.filter((r) => r.tries.includes('4/')).length;
    const total_5_tries = savedResults.filter((r) => r.tries.includes('5/')).length;
    const total_6_tries = savedResults.filter((r) => r.tries.includes('6/')).length;

    const data = [
      ['', 'Total'],
      ['1', total_1_tries],
      ['2', total_2_tries],
      ['3', total_3_tries],
      ['4', total_4_tries],
      ['5', total_5_tries],
      ['6', total_6_tries],
    ];

    setChartData(data);
  }

  useEffect(() => {
    loadStatistics(results);
  }, [results]);
  
  return (
    <div className='container'>
      <div className="mt-5">
        <h3>Statistics</h3>
        <div className='row mt-4'>
          <div className='col'>
            <div className="card text-center">
              <div className="card-header">
                Games played
              </div>
              <div className="card-body">
                <h4>{ gamesPlayed }</h4>
              </div>
              <div className="card-footer text-muted">
                Last: { lastDate }
              </div>
            </div>
          </div>
          <div className='col'>
            <div className="card text-center">
              <div className="card-header">
                Win Rate
              </div>
              <div className="card-body">
                <h4>{ winsPercentage }%</h4>
              </div>
              <div className="card-footer text-muted">
                Wins: {numberWins}, Losses: {numberLosses}
              </div>
            </div>
          </div>
        </div>
        <div className='row mt-4 mb-4'>
          <div className='col'>
            <div className="card text-center">
              <div className="card-header">
                Tries Distribution
              </div>
              <div className="card-body">
                {chartData.length > 0 ?
                  <Chart
                    chartType="Bar"
                    data={chartData}
                    width="100%"
                    height="250px"
                    options={{ legend: { position: "none" }, colors: ['#6aaa64'] }}
                  /> : 'No data'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
