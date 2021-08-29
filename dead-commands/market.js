const fs = require('fs');

const http = require("https");

const { MessageAttachment } = require('discord.js') 
const { CanvasRenderService } = require('chartjs-node-canvas')

const options = {
	"method": "GET",
	"hostname": "apidojo-yahoo-finance-v1.p.rapidapi.com",
	"port": null,
	"path": "/market/get-charts?symbol=HYDR.ME&interval=1d&range=3mo&region=US&comparisons=%5EGDAXI%2C%5EFCHI",
	"headers": {
		"x-rapidapi-key": "c984530017mshbdb2c048e57d42ep1e5d35jsn211d0d4a6d09",
		"x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
		"useQueryString": true
	}
};

const price = []
const time = []

const width = 800
const height = 800

const plugin = {
        id: 'custom_canvas_background_color',
        beforeDraw: (chart) => {
          const ctx = chart.canvas.getContext('2d');
          ctx.save();
          ctx.globalCompositeOperation = 'destination-over';
          ctx.fillStyle = 'black';
          ctx.fillRect(0, 0, chart.width, chart.height);
          ctx.restore();
        }
      };


module.exports.run = async (bot, message, args) => {

        const req = http.request(options, function (res) {
                const chunks = [];
        
                res.on("data", async function (chunk) {
                        chunks.push(chunk);
                        const obj = JSON.parse(chunk)
                        const data = obj.chart.result[0].comparisons[0].close

                        //Get Data From JSON file of live time and prices
                        for(const item in data)
                        {
                                if(item == null)
                                {
                                        continue
                                }
                                else
                                {
                                price.push(data[item])
                                time.push(item)
                                }
                        }
                        const canvas = new CanvasRenderService(width, height)
        
                        const configuration = 
                        {
                                type:'line',
                                data: {
                                        labels: time,
                                        datasets: 
                                        [
                                                {
                                                        label: 'Stocks',
                                                        data: price,
                                                        backgroundColor: '#7289d9',
                                                        borderWidth: 2,
                                                        borderColor: 'rgb(255,255,255)',
                                                        fill: false,
                                                },
                                        ],
                                },
                                plugins: [plugin],
                        }


                        const image = await canvas.renderToBuffer(configuration)

                        const attachment = new MessageAttachment(image)

                        message.channel.send(attachment)
    
                });
        
                res.on("end", function () {
                        const body = Buffer.concat(chunks);
                        //console.log(body.toString());
                });
        
        });
        
        
        
        req.end();
        
    
}
