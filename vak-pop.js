(function () {
  const pop = { // zdroj ČSÚ 31. 12. 2020
    '0-17': 1999465,
    '18-24': 671799,
    '25-29': 651892,
    '30-34': 722127,
    '35-39': 762998,
    '40-44': 923446,
    '45-49': 839278,
    '50-54': 686236,
    '55-59': 653501,
    '60-64': 651567,
    '65-69': 678927,
    '70-74': 602974,
    '75-79': 408629,
    '80+': 441100,
  };

  fetch('https://data.irozhlas.cz/covid-uzis/vak_vek_prvni.json')
    .then((response) => response.json())
    .then((data) => {
      const lastDay = data.slice(-1)[0];
      const decUpd = lastDay.ind.split('-');

      const tmp = {};
      data.forEach((day) => {
        Object.keys(day).forEach((group) => {
          if (!(group in tmp)) {
            tmp[group] = 0;
          }
          tmp[group] += day[group];
        });
      });
      delete tmp.ind;

      const dat = [];
      Object.keys(tmp).forEach((group) => {
        dat.push([group, tmp[group]]);
      });

      dat.sort((a, b) => {
        if (a[0] < b[0]) { return -1; }
        if (a[0] > b[0]) { return 1; }
        return 0;
      });

      const datLeft = [];
      dat.forEach((row) => {
        datLeft.push([
          row[0],
          pop[row[0]] - row[1],
        ]);
      });
      dat.shift();
      dat.pop();
      datLeft.shift();
      datLeft.pop();

      Highcharts.setOptions({
        lang: {
          numericSymbols: [' tis.'],
        },
      });

      Highcharts.chart('covid_vak_pop', {
        chart: {
          type: 'bar',
          spacingLeft: 0,
          spacingRight: 0,
        },
        credits: {
          href: 'https://www.uzis.cz/',
          text: 'Zdroj dat: ÚZIS, počet obyvatel ČSÚ',
        },
        title: {
          text: 'Očkovaní proti covid-19',
          align: 'left',
          style: {
            fontWeight: 'bold',
          },
        },
        subtitle: {
          text: `Alespoň jedna dávka, aktualizováno ${parseInt(decUpd[2])}. ${parseInt(decUpd[1])}.`,
          align: 'left',
        },
        xAxis: {
          categories: dat.map((r) => r[0]),
          crosshair: true,
        },
        yAxis: {
          title: {
            text: 'počet osob',
          },
        },
        tooltip: {
          backgroundColor: '#ffffffee',
          headerFormat: '<span style="font-size:0.8rem"><b>Věk {point.key}</b></span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>'
                          + '<td style="padding:0"><b>{point.y:.0f}</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true,
          style: {
            fontSize: '0.8rem',
          },
        },
        plotOptions: {
          series: {
            stacking: 'normal',
            pointWidth: 12,
            borderWidth: 1,
            borderRadius: 0,
            animation: false,
          },
        },
        series: [
          {
            name: 'naočkováno',
            data: dat,
            color: '#6baed6',
          },
          {
            name: 'zbývá',
            data: datLeft,
            color: '#cb181d',
          },
        ],
      });
    });
}());
