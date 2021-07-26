(function () {
  const pop = {
    '80+': 447526,
    '75-79': 417201,
    '70-74': 621177,
    '65-69': 672418,
    '60-64': 625465,
    '55-59': 669733,
    '50-54': 691083,
    '45-49': 882586,
    '40-44': 893321,
    '35-39': 753310,
    '30-34': 718931,
    '25-29': 620925,
    '18-24': 669492,
    '0-17': 2018609,
  };

  function parseD(str) {

  };

  fetch('https://data.irozhlas.cz/covid-uzis/vak_vek_prvni.json')
    .then((response) => response.json())
    .then((data) => {
      data.sort((a, b) => Date.parse(a.ind) - Date.parse(b.ind));

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

      dat.push(['80+', tmp['80+']]); // wtf
      dat.push(['0-17', tmp['0-17']]);

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
