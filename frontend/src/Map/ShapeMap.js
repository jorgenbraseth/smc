import React, {Component} from 'react';
import {Map, TileLayer, GeoJSON} from 'react-leaflet';

class ShapeMap extends Component {
    constructor() {
        super();
        this.state = {
            lat: 51.505,
            lng: -0.09,
            zoom: 13,
            selected: []
        }
    }

    bindShape(feature, layer) {
        layer.on('click', () => {
            this.selectToggle(feature.properties.id)
        })
    }

    selectToggle(shape) {
        let currentlySelected = this.state.selected;
        var index = currentlySelected.indexOf(shape);
        if (index > -1) {
            currentlySelected.splice(index, 1);
        } else {
            currentlySelected.push(shape)
        }
        if(currentlySelected.length > 2){
            currentlySelected = currentlySelected.slice(1);
        }
        this.setState({
            selected: currentlySelected
        })
        this.forceUpdate()
    }

    shapeColor(shape) {
        let c = this.state.selected.indexOf(shape) !== -1 ? "green" : "#777777";
        return c;
    }

    clearSelected() {
        this.setState({selected:[]})
    }
    unionSelected() {
        this.props.union(this.state.selected)
            .then(this.clearSelected.bind(this));
    }

    intersectSelected() {
        this.props.intersect(this.state.selected)
            .then(this.clearSelected.bind(this));
    }
    reset() {
        this.props.reset()
            .then(this.clearSelected.bind(this));
    }

    render() {
        const position = [this.state.lat, this.state.lng];
        const color = this.shapeColor.bind(this);
        return (<div>
                <header>
                    <h1>Shape modifier 2000</h1>
                    <button
                        style={{backgroundColor: "#cc0000", color: "#990000"}}
                        onClick={this.reset.bind(this)}>Reset Shapes</button>
                    <button
                        disabled={this.state.selected.length !== 2}
                        style={{backgroundColor: "#166e00"}}
                        onClick={this.unionSelected.bind(this)}>Union</button>
                    <button
                        disabled={this.state.selected.length !== 2}
                        style={{backgroundColor: "#6e2813"}}
                        onClick={this.intersectSelected.bind(this)}>Intersect</button>
                </header>
                <section>
                <Map center={position} zoom={this.state.zoom} style={{height: "100vh"}}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    />
                    {this.props.shapes.map((f) => <GeoJSON
                        key={Math.random()}
                        data={f}
                        onEachFeature={this.bindShape.bind(this)}
                        style={{
                            fillColor: color(f.properties.id),
                            color: color(f.properties.id)
                        }}
                    />)}
                </Map>
                </section>
            </div>
        )
    }

}

export default ShapeMap;

