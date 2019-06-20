import React, {Component}  from 'react';
import './App.css';
import ShapeMap from "./Map/ShapeMap";
import repo from "./repo/repoFunctions.js";
import './style.css';

class App extends Component {
    constructor(){
        super();
        this.state = {
            shapes: []
        }
    }

    refreshShapes() {
        return repo.getAll().then((shapes) => {
            this.setState({shapes})
        })
    }
    componentDidMount() {
        this.refreshShapes();
    }

    intersect(shapeIds) {
        return repo.intersect(shapeIds).then(this.refreshShapes.bind(this));
    }

    union(shapeIds) {
        return repo.union(shapeIds).then(this.refreshShapes.bind(this));
    }

    reset() {
        return repo.reset().then(this.refreshShapes.bind(this));
    }

    render() {
      return (
            <div className="App">
                <ShapeMap shapes={this.state.shapes}
                          intersect={this.intersect.bind(this)}
                          union={this.union.bind(this)}
                          reset={this.reset.bind(this)}
                />
            </div>
        );
    }
}
export default App;
