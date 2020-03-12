import React, { Component } from 'react';
import {Button, Modal } from 'react-bootstrap';

import './taskboardstyle.css';

export default class App extends Component {
  constructor(props){
    super(props);
      
      this.state = {
        show : false,
        showedit : false, 
        tasks: [],
        modifieddate : [],
        editTitle : '',
        editHours : '',
        editPrio : '',
        time : [],
      }
      this.handleShow = this.handleShow.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.addTask = this.addTask.bind(this);
      this.delete = this.delete.bind(this);
      this.edit = this.edit.bind(this);
      this.updateTitle = this.updateTitle.bind(this);
      this.updateHours = this.updateHours.bind(this);
      this.updatePrior = this.updatePrior.bind(this);
      this.handleUpdate = this.handleUpdate.bind(this);
} //cons

addTask =(e) => {
  if(isNaN(this.hours.value)){
    alert("No of hours is not a number.");
  }
  else if (this.title.value !== "" && this.hours.value !== "" && this.priority.value !== "") {
    var newItem = {
      newTitle: this.title.value,
      newHours : this.hours.value,
      newPrio : this.priority.value,
      category : 'todo',
      bgColor : "#ff0000",
      key : Date.now(),
    };
    this.state.tasks.push(newItem)
    this.title.value = "";
    this.hours.value = "";
    this.priority.value = "";
    this.setState({time : new Date().toLocaleString() })
  }
  else {alert("Fields cannot be empty");}
  e.preventDefault();
} //add task

delete = (key) => {
  var filteredItems = this.state.tasks.filter(function (item) {
    return (item.key !== key);
  }); 

  this.setState({
    tasks: filteredItems,
    time : new Date().toLocaleString()
  });
} //deleteItem

async edit(key){
  this.state.tasks.filter((elem) => {
    if(elem.key == key){
      this.state.editTitle  = elem.newTitle
      this.state.editHours = elem.newHours
      this.state.editPrio = elem.newPrio
      this.state.editkey = elem.key
    return elem;
    }
  }); 
  await  this.setState({
    showedit : true,
  });
} //edit

async updateTitle (event){
  await this.setState({
    updatedTitle : event.target.value,
  })
}

async updateHours (event){
  await  this.setState({
      updatedHours : event.target.value
  })
}

async updatePrior (event){
  await  this.setState({
    updatedPrior : event.target.value
  })
}

handleUpdate(){
  if(isNaN(this.state.updatedHours)){
    alert("No of hours is not a number.");
  }
  else if (this.state.updatedTitle !== "" && this.state.updatedHours !== "" && this.state.updatedPrior !== "") {
    this.state.tasks.filter((elem) => {
      if(elem.key == this.state.editkey){
        elem.newTitle = this.state.updatedTitle
        elem.newHours = this.state.updatedHours
        elem.newPrio = this.state.updatedPrior
      }  
    });
  
    this.setState({ 
      showedit : false, 
      time : new Date().toLocaleString(), 
    });
  } //else if
  else{alert("Fields cant be empty");}
} //handleupdate

handleClose() {
  this.setState({ 
    show : false,
    showedit : false,  
  });
}

handleShow() {
  this.setState({ show: true });
}
onDragStart = (ev, id) => {
  console.log('dragstart:',id);
  ev.dataTransfer.setData("id", id);
}

onDragOver = (ev) => {
  ev.preventDefault();
}

onDrop = (ev, cat) => {
  let id = ev.dataTransfer.getData("id");
  let tasks = this.state.tasks.filter((elem) => {
    if (elem.key == id) {
          elem.category = cat;
          if(elem.category == "inprogess"){elem.bgColor = "#ff9900"}
          else if(elem.category == "testing"){elem.bgColor = "#ffdd00"}
          else if(elem.category == "complete"){elem.bgColor = "#99c957"}
          else {elem.bgColor = "#ff0000"}
      }
    return elem;
  });

  this.setState({
    tasks: tasks,
    time : new Date().toLocaleString() 
  });
}

render() {
  var taskcat = {
      todo: [],
      inprogess : [],
      testing :[],
      complete:[],
  }
  if(this.state.tasks){
    this.state.tasks.forEach ((t) => {
      taskcat[t.category].push(
        <div key={t.key} 
            onDragStart = {(e) => this.onDragStart(e, t.key)}
            draggable
            className="taskDiv" style={{backgroundColor : t.bgColor}}>
            <div className="taskHeader" >
              <button type="button" className="edit" aria-label="Edit" onClick={() => this.edit(t.key)}>
              <span aria-hidden="true" className="glyphicon glyphicon-pencil"></span>
              </button>
              
              <button type="button" className="close" aria-label="Close" onClick={() => this.delete(t.key)}>
                  <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="taskBody">  
              <p>{t.newTitle}</p>
              <p>{t.newHours}</p>
              <p>{t.newPrio}</p>
            </div>
          </div>
        );
    });
  } //if
  else{console.log("adding")}

  return (
    <div>
      <p className="rotate">Kanban Board</p>
      <div className="taskBoard container">
        <div className="row-fluid">
          <div className="col-md-2 summary">
            <p> Summary</p>
            <p className="todo-p"> To Do : {taskcat.todo.length}</p>
            <p className="inprogress-p"> In Progress : {taskcat.inprogess.length}</p>
            <p className="testing-p"> Testing : {taskcat.testing.length}</p>
            <p className="done-p"> Done : {taskcat.complete.length}</p>
            <div className="addbtn-div">
              <Button className="btn btn-success" onClick={this.handleShow}>
                Add Task
              </Button>
            </div>
            <div className="clearfix"></div>
            <p className="time-p"> Last Updated : {this.state.time}</p>
          </div>
          <div className="todo col-md-2"
              onDragOver={(e)=>this.onDragOver(e)}
              onDrop={(e)=>{this.onDrop(e, "todo")}}>
              <span className="task-header">To Do</span>
              <div className="task-body">{taskcat.todo} </div>
          </div>
          <div className="droppable col-md-2" 
              onDragOver={(e)=>this.onDragOver(e)}
              onDrop={(e)=>this.onDrop(e, "inprogess")}>
                <span className="task-header">In Progess</span>
                <div className="task-body">{taskcat.inprogess}</div>
          </div>
          <div className="droppable col-md-2" 
              onDragOver={(e)=>this.onDragOver(e)}
              onDrop={(e)=>this.onDrop(e, "testing")}>
                <span className="task-header">Testing</span>
                <div className="task-body">{taskcat.testing} </div>
          </div>
          <div className="droppable col-md-2" 
              onDragOver={(e)=>this.onDragOver(e)}
              onDrop={(e)=>this.onDrop(e, "complete")}>
                <span className="task-header">Complete</span>
                <div className="task-body">{taskcat.complete} </div>
          </div>
        </div> {/*row-fluid */}
    
        {/* add modal start */}
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Task</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="form-group">
              <div className="row">
                <label className="col-md-4 control-label task-label" htmlFor="Feature">Enter Title : <span className="glyphicon glyphicon-asterisk"></span></label>
                <div className="col-md-5">
                  <input type="text" className="form-control" placeholder="Enter Title" ref = {(input)=> this.title = input} />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <label className="col-md-4 control-label task-label" htmlFor="Feature">Enter No of Hours : <span className="glyphicon glyphicon-asterisk"></span></label>
                <div className="col-md-5">
                  <input type="text" className="form-control" placeholder="Enter Hours" ref = {(input)=> this.hours = input} />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <label className="col-md-4 control-label task-label" htmlFor="Feature">Enter Priority : <span className="glyphicon glyphicon-asterisk"></span></label>
                <div className="col-md-5">
                  <input type="text" className="form-control" placeholder="Enter Priority" ref = {(input)=> this.priority = input}  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn btn-success" onClick={this.addTask}>Add Task</Button>
            <Button className="btn btn-warning" onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
        {/* add modal end */}

        {/* edit start */}
        <Modal show={this.state.showedit} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          
          <div className="form-group">
            <div className="row">
            <div className="col-md-5">
                <input type="text" className="form-control" placeholder="Enter Title"  defaultValue={this.state.editTitle} onChange = {(editedTitle) => this.updateTitle(editedTitle)}/>
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
            <div className="col-md-5">
                <input type="text" className="form-control" placeholder="Enter Hours"  defaultValue={this.state.editHours} onChange = {(editedHours) => this.updateHours(editedHours)}/>
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
            <div className="col-md-5"> 
                <input type="text" className="form-control" placeholder="Enter Priority"  defaultValue={this.state.editPrio} onChange = {(editedPrior) => this.updatePrior(editedPrior)}/>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-success" onClick={this.handleUpdate}>Save</Button>
          <Button className="btn btn-warning" onClick={this.handleClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>
      {/* end edit */}
    </div> {/* taskboard */}
  </div>);
  }
}