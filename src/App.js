import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'

import Rank from './components/Rank/Rank'
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: 'ed54c7f6137a4c6cb49a7cafd5265f5d'
 });

const particleOptions={
  particles: {
    number:{
        value:30,
        density:{ 
          enable:true,
          value_area:200
        }
    }
  }
}

class App extends Component {

  constructor(){
    super();
    this.state={
      input: '',
      imageUrl: '',
      box: {}
    }
  }

  calculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('input_image');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width,height);
    return {
      leftCol : clarifaiFace.left_col * width,
      topRow : clarifaiFace.top_row * height,
      rightCol : width - (clarifaiFace.right_col * width),
      bottomRow : height - (clarifaiFace.bottom_row * height)
    }
    
  }

  displayFaceBox = (box) =>{
      console.log(box);
      this.setState({box:box});
  }

  onInputChange = (event)=>{
   // console.log(event.target.value);
    this.setState({input : event.target.value});
  }
  onButtonSubmit = ()=>{
   // this.box={};
    this.setState({imageUrl: this.state.input});

    app.models.predict(
        Clarifai.FACE_DETECT_MODEL,//"a403429f2ddf4b49b307e318f00e528b" 
        this.state.input)
    .then(response=> this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err=>console.log(err));
  }
  render() {
    return (
      <div className="App">
            <Particles className='particles'
                params={particleOptions}
            />
           <Navigation/>
           <Logo/>
           <Rank/>
           <ImageLinkForm 
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}/>
           <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>   
      </div>
    );
  }
}

export default App;
