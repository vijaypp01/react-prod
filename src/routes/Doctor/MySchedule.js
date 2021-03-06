import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import actions from '../../redux/actions';
import Pagination from '../../components/Pagination';
import Loading from '../../components/Loading';
import Select from '../../components/Select';
import makeTranslater from '../../translate';
import {makeApiData} from '../../api';
import {imageUrl} from '../../../api/config';
import {getClaimStatusLabel, getVerificationStatusLabel, text_truncate, getSalutation, getStatusLabel} from '../../utils';
import Editor from '../../components/Common/Editor';
var DateTimeField = require('react-bootstrap-datetimepicker');
import Moment from 'moment';
import {
	Row,
	Col,
	Grid,
	Panel,
	Table,
	PanelBody,
	PanelHeader,
	PanelContainer,
	Icon,
	Button,
	Form,
	FormGroup,
	ControlLabel,
	InputGroup,
	FormControl,
	Checkbox,
	HelpBlock,
	PanelTabContainer,
	Modal,
	ButtonGroup,
	BPanel,
	Label,ListGroup,ListGroupItem,
	OverlayTrigger,
	Popover,
} from '@sketchpixy/rubix';

import url from 'url';

const viewName = 'doctor_doctor_myschedule';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.doctor_myschedule
}))


export default class DoctorMySchedule extends React.Component {

	changeView = url => {
		this.props.dispatch({
			type: 'RESET_FILTERS',
		})
		this.props.router.push(url);
	};

	constructor(props) {
		super(props);

		this.state = {
			displayModal: false,
			displayViewModal: false,
			modalViewData: null
		}

		this.handleChangeDateStart = (newDate) => {
			var newDate = new Date(parseInt(newDate));
			newDate=moment(newDate).format('YYYY-MM-DD');
    		return this.updateData('from_date', newDate);
  		}

  		this.handleChangeDateEnd = (newDate) => {
  			var newDate = new Date(parseInt(newDate));
			newDate=moment(newDate).format('YYYY-MM-DD');
    		return this.updateData('to_date', newDate);
  		}


		this.handleDataUpdate = event => {
			let value;
			if (event.target.type === 'checkbox')
				value = event.target.checked;
			else
			 value = event.target.value;

			this.updateData(event.target.name, value);
		}

		this.closeModal = (event) => { 
			this.updateData('isVisibleSug', false);
		}

		this.closeModalBlock = (event) => { 
			this.updateData('isVisibleBlock', false);
		}

		this.editDetail = event => {
			let id = event.target.getAttribute('data-id');
			this.props.dispatch(actions.doctor_article.edit(this.props, id))
		}

	}

	makeFilter(name) {
		let dispatch = this.props.dispatch;
		return event => {
			dispatch({
				type: 'UPDATE_FILTER',
				name,
				value: event.target.value
			});
		}
	}

	search() {
		this.props.router.push(
			`${this.props.location.pathname}?view=${this.props.location.query.view}`
		);
	}

	publish(name,email,mobile,id,suggestion_text){ 

			this.updateData('model_name', name);
			this.updateData('model_email', email);
			this.updateData('model_mobile', mobile);
			this.updateData('model_id', id);
			this.updateData('suggestion', suggestion_text);
			this.updateData('isVisibleSug', true);
	}


	showPopupBlock(){ 
		let dispatch = this.props.dispatch;	
		return dispatch(
			actions.doctor_myschedule.loadSchedule(
				this.props
			)
		);
		//this.updateData('isVisibleBlock', true);
	}

	static fetchData(store) {
		return store.dispatch(
			actions.doctor_myschedule.init(
				store.getState()
			)
		);
	}

	render() {
		if (this.props.loading) return <Loading/>;
		let content, __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		return (
			<Row>
				<Col xs={12}>
					<PanelContainer controls={false} className="overflow-visible">
						<Panel>
							<PanelHeader className='bg-green'>
								<Grid>
									<Row>
										<Col xs={4} className='fg-white'>
											<h3>{__('My Schedule')}</h3>
										</Col>
										<Col xs={8} className='text-right'>
											<h3>
												<ButtonGroup style={{verticalAlign: 'top'}}>
													<Button
														onClick={() => this.changeView(this.props.location.pathname+'?view=upcoming')}
														className={`btn-inverse btn-outlined btn btn-default ${this.props.location.query.view !== 'completed' ? 'active' : ''}`}>
														{__('Upcoming')}
													</Button>
													<Button
														onClick={() => this.changeView(this.props.location.pathname+'?view=completed')}
														className={`btn-inverse btn-outlined btn btn-default ${this.props.location.query.view === 'completed' ? 'active' : ''}`}>
														{__('Completed')}
													</Button>
												</ButtonGroup>
												{' '}
												<Button
													inverse
													outlined
													style={{marginBottom: 5}}
													bsStyle='default'
													onClick={() => this.showPopupBlock()}>
													{__('Block Schedule')}
												</Button>
											</h3>
										</Col>
									</Row>
								</Grid>
							</PanelHeader>
							<PanelBody>
								<Grid>
									{this.renderList(__)}
								</Grid>
							</PanelBody>
						</Panel>
					</PanelContainer>
				</Col>
			</Row>
		);
	}

	renderList(__) {
		return (
			<Row key="article-list">
				<Col xs={12}>
					<Row>
						<Col xs={4}>
							<FormGroup controlId="hospital_id">
			                    <Select
			                        name='hospital_id'
			                        placeholder={__('Select Hospital Name')}
			                        onChange={this.makeFilter("hospital_id")}
			                        value={this.props.filter.hospital_id}
			                        options={this.props.helperData.list}/>
                			</FormGroup>
                		</Col>
                		<Col xs={4}>
							<FormGroup controlId="status_id">
			                    <Select
			                        name='status_id'
			                        placeholder={__('Select Status')}
			                        onChange={this.makeFilter("status_id")}
			                        value={this.props.filter.status_id}
			                        options={
			                        	this.props.location.query.view === 'completed' ?
			                        	[
					                        {label:__('Completed'),value:'0'},
					                        {label:__('Absent'),value:'4'},
					                        {label:__('Canceled'),value:'3'},
				                        ] :
				                        [
				                        	{label:__('Confirmed'),value:'1'},
					                        {label:__('Booked'),value:'2'},
				                        ]
			                       	}/>
                			</FormGroup>
                		</Col>
                		<Col xs={4}>
                			<Icon
								className={'fg-brown'}
								title={__('Edit')}
								style={{fontSize: 30,float:"left"}}
								glyph="glyphicon-search"
								onClick={::this.search}/>
                		</Col>
					</Row>
					<div>
						{this.props.myschedule.map(this.getDataRow, this)}
						{this.props.myschedule.length === 0 && this.getNoDataRow(__)}
					</div>
				</Col>
				<Col xs={12}>
					<Pagination
						data={this.props.pageInfo}
						onSelect={::this.changePage}
					/>
				</Col>
				<Modal show={this.props.modelData.isVisibleSug} onHide={this.closeModal} bsSize="large">
			        <Modal.Header closeButton>
			          	<Modal.Title>{__('Add Suggestion')}</Modal.Title>
			        </Modal.Header>
			        <Modal.Body>
			          	<Row>
			          		<Col sm={12}>
			          			<h5 style={{marginTop: '0px'}}>{__('Patient Name') } : {this.props.modelData.model_name}</h5>
								<h5 style={{marginTop: '0px'}}>{__('Patient Mobile') } : {this.props.modelData.model_mobile}</h5>
								<h5 style={{marginTop: '0px'}}>{__('Patient Email') } : {this.props.modelData.model_email}</h5>
			          		</Col>
			          	</Row>
			        </Modal.Body>
			        <Modal.Footer>
			        	<Row>
			        		<Col sm={12} className='text-left'>
				        		<FormGroup controlId="formControlsTextarea">
									<ControlLabel>{__('Suggestion')}</ControlLabel>
									<FormControl
										componentClass="textarea"
										name="suggestion"
										placeholder={__('Write Note/Suggestion')}
										onChange={this.handleDataUpdate}
										value={this.props.modelData.suggestion}/>
								</FormGroup>
			        		</Col>
			        	</Row>
			        	<Button
			        		bsStyle='primary'
			        		disabled={this.props.modelData.isDisableContinueBtn}
			        		data-action-index={0} 
			        		onClick={() => this.saveNote()}>
			        		{__('Save')}
			        	</Button>
			        </Modal.Footer>
		    	</Modal>



		    	<Modal show={this.props.modelData.isVisibleBlock} onHide={this.closeModalBlock} bsSize="large">
				        <Modal.Header closeButton>
				          	<Modal.Title>{__('Block Schedule')}</Modal.Title>
				        </Modal.Header>
				        <Modal.Body>
				          	
				        	<Row>
				        		<Col sm={12} className='text-left'>
				        		{__("Doctor can block Schedule for leaves and patient won't be able to book appointment")}
				        		</Col>

				        		<Col sm={6} className='text-left'>
				        		<FormGroup controlId="formControlsTextarea">
								  <ControlLabel>{__('Leave Details')}</ControlLabel>
								  <FormControl componentClass="textarea" name="leave_details" placeholder={__('Leave Details')} onChange={this.handleDataUpdate} value={this.props.modelData.leave_details} />
								</FormGroup>
				        		</Col>

				        		<Col sm={3} className='text-left'>
				        		<FormGroup controlId='name'>
                                <ControlLabel>{__('Start Date')}</ControlLabel>
                                <DateTimeField
                                 inputFormat={"YYYY-MM-DD"}
                                 placeholder={__('Start Date')}
                                 value={this.props.modelData.from_date}
                                 name='from_date'
                                 onChange={this.handleChangeDateStart}
                                />
                                            
                                </FormGroup>
				        		</Col>


				        		<Col sm={3} className='text-left'>
				        		<FormGroup controlId='name'>
                                <ControlLabel>{__('End Date')}</ControlLabel>
                                <DateTimeField
                                 inputFormat={"YYYY-MM-DD"}
                                 placeholder={__('End Date')}
                                 value={this.props.modelData.to_date}
                                 name='to_date'
                                 onChange={this.handleChangeDateEnd}
                                />
                                            
                                </FormGroup>
				        		</Col>

				        		<Col sm={12} className='text-right'>
				        		<Button 
				        		bsStyle='primary' 
				        		data-action-index={0} 
				        		disabled={this.props.modelData.isDisableBlockBtn}
					        	onClick={() => this.saveBlock()}
					        	>Save
					        	</Button>
					        	</Col>
				        	</Row>
				        	
				        	<br></br>

				        	<div style={{overflowY:"scroll",height:350}}>
				        	<ListGroup>
				        	<ListGroupItem>
				        	<h4>{__('Blocked Schedule List')}</h4>
				        	</ListGroupItem>
				        	{this.props.modelData.scheduleList.map(this.getDataRowBlock, this)}

				        	{this.props.modelData.scheduleList.length==0 ? 
				        	<ListGroupItem>
				        	<h5>{__('No Block Schedule added in your list')}</h5>
				        	</ListGroupItem>
				        	:""}

				        	</ListGroup>
				        	</div>


				        </Modal.Body>
		    	</Modal>
				

			</Row>
		);
	}



	getDataRowBlock(item, index) {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		return (
				<ListGroupItem>
				{item.leave_details} 
				<p style={{float:"right"}}>
				<Label bsStyle="primary">{moment(item.from_date, 'YYYY-MM-DD').format('YYYY-MM-DD')}</Label>
				-
				<Label bsStyle="info">{moment(item.to_date, 'YYYY-MM-DD').format('YYYY-MM-DD')}</Label>
				</p>
				</ListGroupItem>
		);
	}




	getDataRow(item, index) {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		return (
			<BPanel key={item.id}>
				<Row>
					<Col sm={2} className='text-center'> 
						<Icon glyph="glyphicon-calendar" style={{fontSize:'60px'}}/>
						<h5 style={{marginTop: '0px'}}>{moment(item.book_date, 'YYYY/MM/DD').format('DD/MM')}</h5>
						<h6 style={{marginTop: '0px'}}>{item.from_time}</h6>
					</Col>
					<Col sm={5}>
						<h5 style={{marginTop: '0px'}}>{__('Appointment ID') } : {item.id}</h5>
						<h5 style={{marginTop: '0px'}}>{__('Patient Name') } : {item.patient_name}</h5>
						<h5 style={{marginTop: '0px'}}>{__('Patient Mobile') } : {item.patient_mobile}</h5>
						<h5 style={{marginTop: '0px'}}>{__('Patient Email') } : {item.patient_email}</h5>
						<h5 style={{marginTop: '0px'}}>{__('Hospital Name') } : {item.hospital.hospitaldetails[0]['hospital_name']}</h5>
						<h5 style={{marginTop: '0px'}}>{__('Status') } : {this.getStatusIcon(item)}</h5>
					</Col>
					<Col sm={5}>
						<div>
							{item.status==2 ? <Button bsStyle="success" outlined onClick={() => this.changeStatus(item.id,1)} >{__('Confirm')}</Button> : '' }
							{' '}
							{item.status==1 ? <Button bsStyle="info" outlined onClick={() => this.changeStatus(item.id,4)} >{__('Absent')}</Button> : '' }
							{' '}
							{item.status==1 ? <Button bsStyle="primary" outlined onClick={() => this.publish(item.patient_name,item.patient_mobile,item.patient_email,item.id,item.suggestion)} >{__('Add Suggestions')}</Button> : '' }
							{' '}
							{(item.status==2 || item.status==1) ? <Button bsStyle="danger" outlined onClick={() => this.changeStatus(item.id,3)} >{__('Cancel')}</Button> : '' }
							{' '}
							{
								item.status==0 &&
								<OverlayTrigger
									rootClose
									trigger='click'
									placement='bottom'
									overlay={
										<Popover
											id="suggestion-popover"
											title={__('Note/Suggestion')}>
											<p>{item.suggestion}</p>
										</Popover>
									}>
									<Button bsStyle="primary" outlined>{__('View Suggestions')}</Button>
								</OverlayTrigger>
							}
						</div>
					</Col>
				</Row>
			</BPanel>
		);
	}

	getNoDataRow(__) {
		return (
			<p className='text-center'>{__('No data found')}</p>
		)
	}


	getStatusIcon(item) {
		switch(item.status) {
			case 0:
				return <Label bsStyle='success' style={{height: '20px'}}>Completed</Label>;
			case 1:
				return <Label bsStyle='success' style={{height: '20px'}}>Confirmed</Label>;
			case 2:
				return <Label bsStyle='warning' style={{height: '20px'}}>Booked</Label>;
			case 3:
				return <Label bsStyle='danger'>{item.status_updated_by === item.patientId ? 'Cancelled by patient' : 
				'Cancelled by doctor'}</Label>;
			case 4:
				return <Label bsStyle='info'>Absent</Label>;
		}
	}

	changePage(page) {
		this.props.router.push(
			url.format({
				pathname: this.props.location.pathname,
				query: {
					...this.props.location.query,
					page: page
				}
			})
		);
	}

	makeFilter(name) {
		let dispatch = this.props.dispatch;
		return event => {
			dispatch({
				type: 'UPDATE_FILTER',
				name,
				value: event.target.value
			});
		}
	}

	updateData(name, value) {
		this.props.dispatch({
			type: 'UPDATE_DATA_VALUE',
			name,
			value
		});
	}


	reset() {
		this.props.dispatch({
			type: 'RESET_FILTERS'
		});
		this.props.router.push(this.props.location.pathname);
	}

	startAdd() {

		this.props.dispatch(actions.doctor_article.startAdd(this.props));
	}

	viewList() {
		this.props.dispatch(actions.doctor_article.viewList())
	}

	edit(itemId) {
		this.props.dispatch(actions.doctor_article.edit(this.props, itemId));
	}

	handleEditorChange(name, value) {
		this.props.dispatch({
			type: 'UPDATE_DATA_VALUE',
			name,
			value
		});
	}

	changeStatus(itemId, status) {

		this.props.dispatch(
			actions.doctor_myschedule.changeStatus(
				this.props,
				itemId,
				status
			)
		)
	}

	saveNote() {

		this.props.dispatch(
			actions.doctor_myschedule.saveNote(
				this.props,
			)
		)
	}

	saveBlock() {

		this.props.dispatch(
			actions.doctor_myschedule.saveBlock(
				this.props,
			)
		)
	}

}


