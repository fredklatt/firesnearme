(function()  {
    let tmpl = document.createElement('template');
    const bootstrapscrpt = document.createElement("script");
    const bootstrapcss = document.createElement("link");
    const bootstraptable = document.createElement("script");
    bootstrapcss.rel = "stylesheet";
    bootstrapcss.href = "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css";
    bootstrapcss.integrity = "sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z";
    bootstrapcss.crossOrigin = "anonymous";
    bootstrapscrpt.src = "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js";
    bootstraptable.src = "https://sort-table-js.s3-ap-southeast-2.amazonaws.com/sort-table.js";
    bootstraptable.type = "text/javascript";
    document.head.appendChild(bootstrapcss);
    document.head.appendChild(bootstrapscrpt);
    document.head.appendChild(bootstraptable);
    tmpl.innerHTML = `
        <style>
            th, td, p, input {
                font:14px Verdana;
            }
            table, th, td
            {
                border: solid 2px white;
                border-collapse: collapse;
                padding: 5px 10px;
                text-align: left;
                /* background-color: grey; */
            }
            th {
                font-weight:bold;
                position:sticky;
                top:0;
                background-color: #e5281b;
                color: white;
            }
            #showData {
            height: 100%;
            width: 100%;
            overflow: auto;
            /* margin-top:20px; */
            }
            tr {
              vertical-align:middle;
            }

            tr:nth-child(even) {background-color: #f0f0f0;}

        </style>
        <div id="showData"></div>
    `;

    customElements.define('com-sap-sample-firetablev4', class FireTable extends HTMLElement {


		constructor() {
			super();
			      //this._shadowRoot = this.attachShadow({mode: "open"});
            this.appendChild(tmpl.content.cloneNode(true));
            this._firstConnection = false;
            this.$div = this.querySelector('div');
		}

        //Fired when the widget is added to the html DOM of the page
        connectedCallback(){
            this._firstConnection = true;
            this.redraw();
        }

         //Fired when the widget is removed from the html DOM of the page (e.g. by hide)
        disconnectedCallback(){

        }
    render() {
      function length(obj) {
        return Object.keys(obj).length;
      };
      const Incidenturl = "https://cors-anywhere.herokuapp.com/https://www.rfs.nsw.gov.au/feeds/majorIncidents.json";
      const urlicon = "https://www.rfs.nsw.gov.au/_designs/geojson/fires-near-me/images/";
      var xhttp = new XMLHttpRequest();
      console.log("Test")
      xhttp.open(
        "GET",
        Incidenturl,
        true
      );
      var that = this;
      xhttp.onload = function () {
        var censusData = JSON.parse(xhttp.responseText);
        // EXTRACT VALUE FOR HTML HEADER.
        var col = [];
        var row = [];
        var advice = [];
        var watchact = [];
        var emergencywarning = [];
        var notapplicable = [];
        for (var i = 0; i < length(censusData.features); i++) {
            var str = censusData.features[i].properties["description"];
            var res = str.split("<br />");
            var rowtemp = [];
            for (var j = 0; j < res.length; j++) {
                var items = res[j];
                var index = items.indexOf(':');
                var rowval = items.slice(0, index)
                if (col.indexOf(rowval) === -1) {
                    col.push(rowval);
                }
                var value = items.slice(index + 1);

                // Check to see what kind of Advice level each row has
                if (value === " Advice ") {
                  advice.push(i);
                }

                if (value === " Emergency Warning ") {
                  watchact.push(i);
                }

                if (value === " Watch and Act ") {
                  emergencywarning.push(i);
                }

                if (value === " Not Applicable ") {
                  notapplicable.push(i);
                }
                rowtemp.push(value);
            }
            row.push(rowtemp);
        }
        console.log(advice);
        console.log(watchact);
        console.log(emergencywarning);

        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");
        // console.log("CREATE DYNAMIC TABLE");
        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
        table.setAttribute('id', 'firesnearme');
        table.setAttribute('class', 'js-sort-table');

        var tr = table.insertRow(-1);                   // TABLE ROW.
        // console.log("TABLE ROW");
        var thead = document.createElement("thead");
        for (var i = 0; i < col.length; i++) {
            // console.log("TABLE HEADER " + i);
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            // th.setAttribute('class','js-sort-number');
            thead.appendChild(th);
        }
        table.appendChild(thead);

        for (var i = 0; i < row.length; i++) {
          // console.log("JSON DATA ADDED " + i);
          tr = table.insertRow(-1);


          for (var j = 0; j < col.length; j++) {
              // console.log("JSON DATA ADDED MORE " + j);
              var tabCell = tr.insertCell(-1);
              tabCell.innerHTML = row[i][j];
              if (advice.includes(i) && j == 0) {
                  tabCell.style.color = "#4796ec";
                  var adviceimg = document.createElement('img');
                  adviceimg.src = "https://www.rfs.nsw.gov.au/_designs/geojson/fires-near-me/images/advice.png";
                  tabCell.appendChild(adviceimg);

                  // console.log("Hooray");
              }
              if (watchact.includes(i) && j == 0) {
                  tabCell.style.color = "#f3ed33";
                  // console.log("Hooray");
                  var watchactimg = document.createElement('img');
                  watchactimg.src = "https://www.rfs.nsw.gov.au/_designs/geojson/fires-near-me/images/watch_and_act.png";
                  tabCell.appendChild(watchactimg);
              }
              if (emergencywarning.includes(i) && j == 0) {
                  tabCell.style.color = "#e91a25";
                  // console.log("Hooray");
                  var emergencywarningimg = document.createElement('img');
                  emergencywarningimg.src = "https://www.rfs.nsw.gov.au/_designs/geojson/fires-near-me/images/emergency_warning.png";
                  tabCell.appendChild(emergencywarningimg);
              }
              if (notapplicable.includes(i) && j == 0) {
                  // console.log("Hooray");
                  var notapplicableimg = document.createElement('img');
                  notapplicableimg.src = "https://www.rfs.nsw.gov.au/_designs/geojson/fires-near-me/images/not-applicable.png";
                  tabCell.appendChild(notapplicableimg);
              }
          }
        }

        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        var divContainer = that.$div;
        divContainer.innerHTML = "";
        divContainer.appendChild(table);
        sortTable.init()
      };
      xhttp.send();
      console.log("Test 2")
    };
         //When the custom widget is updated, the Custom Widget SDK framework executes this function first
		onCustomWidgetBeforeUpdate(oChangedProperties) {
		}

        //When the custom widget is updated, the Custom Widget SDK framework executes this function after the update
		onCustomWidgetAfterUpdate(oChangedProperties) {
            if (this._firstConnection){
                this.redraw();
            }
            this.render();
        }

        //When the custom widget is removed from the canvas or the analytic application is closed
        onCustomWidgetDestroy(){
        }


        //When the custom widget is resized on the canvas, the Custom Widget SDK framework executes the following JavaScript function call on the custom widget
        // Commented out by default.  If it is enabled, SAP Analytics Cloud will track DOM size changes and call this callback as needed
        //  If you don't need to react to resizes, you can save CPU by leaving it uncommented.
        /*
        onCustomWidgetResize(width, height){
            redraw()
        }
        */

        redraw(){
        }
    });
})();
