
import React, { useState } from 'react';
import './App.css';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
import LineChart from 'react-linechart';
import '../node_modules/react-linechart/dist/styles.css';



const getdata=(height,time,e,g,timegap)=>{
  if(e===1&&time>600)
    return [];
  if(height<0.01)
  return [];
  
  const timetofall1 = Math.sqrt(2*height/g);
  
  let datas = [];

  for(let i = 0;i<timetofall1;i+=timegap)
  {
    let h = height- 1/2*g*i*i;
    datas = [...datas,{x:i+time,y:h}]
  }

  datas.push({x:timetofall1+time,y:0})
  const timetofall2 = e*timetofall1;
  let datas2 = [];
  for(let i = 0;i<=timetofall2;i+=timegap)
  {
    let h = e*e*height - 1/2*g*i*i;
    datas2 = [{x:timetofall2+timetofall1-i+time,y:h},...datas2]
  }
  console.log(e+"coming here");
  datas2 =[...datas2,{x:timetofall1+timetofall2+time,y:parseInt(e*e*height)}];

  const newTime = timetofall2+timetofall1+time;
  const newHeight = e*e*height;
  const addDatas = getdata(newHeight,newTime,e,g,timegap);

  datas = datas.concat(datas2);
  datas = datas.concat(addDatas);
  return datas;
}


function Header(){
  return (<h2>Edunomics React Graph</h2>)
}

function Slider({onChange})
{
  const [value,setValue] = useState(0.4);
  const onSlide=(e)=>{
    // console.log(e.target.value);
    setValue(e.target.value);
    onChange(e.target.value);
  }
  return(
    <>
    <h4>Coefficient of Restitution:-  {value}</h4>
    <RangeSlider
      step ={0.01}
      tooltipPlacement ={'top'}
        min = {0}
        max = {0.99}
        value={+value}
        onChange={onSlide}
      />
    </>
    
  )
}
function Graph(){
  // const [data1,setData] = useState([]);
  
  const g = 9.8;
  const [height,setHeight] = useState(50);
  const [ret,setRet] = useState(0.4);
  let timegap = 0.5;
  let data1=getdata(height,0,ret,g,timegap);
  
  const onChange = (e)=>{
    // ret = e;
    setRet(e);
    data1 = getdata(height,0,e,g,timegap);
  }
  const onSubmit = (e)=>{
    e.preventDefault();
    console.log(ret);
   
    data1 = getdata(height,0,ret,g,timegap);
  }
   
  let data = [
    {									
        color: "steelblue", 
        points: data1
    }
  ];
  return (
    
		<div>
      <Slider onChange = {onChange}/>
      <br/>
      <form className = "my-form" onSubmit = {onSubmit}>
        <label>Height <strong> (Please enter positive number less than 5000)</strong></label>
        <input type = "number" min="1" max="50000" value ={height} onChange = {e=>setHeight(e.target.value)}/>     
        <button className ="btn">Make Graph</button>
      </form>
      
      <LineChart 
          onPointClick = {(event,point)=>console.log(point)}
          yMin = '0'
          xLabel = "Time"
          yLabel = "Height"
          // width={600}
          height={400}
          data={data}
      />
  </div>
		);
}
function App() {
  return (
    <div className="App">
      <Header/>
      <div className = "container">
        
        <Graph/>
      </div>
    </div>
  );
}

export default App;
