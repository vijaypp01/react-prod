import {combineReducers} from 'redux';

function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_ADMIN_JOB_LIST':
			return 'LIST';
		case 'SET_ADMIN_JOB_VIEW_DATA':
			return 'VIEW_FORM';
		default:
			return state;
	}	
}

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_ITEM_STATUS':
			var itemId = parseInt(action.itemId);
			return state.map(item => {
				if (item.id === itemId)
					item.is_active = parseInt(action.status);
				return item;
			});
		default:
			return state;
	}
}

function pageInfo(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				totalData: action.data.totalData,
				pageCount: action.data.pageCount,
				pageLimit: action.data.pageLimit,
				currentPage: action.data.currentPage
			};
		default:
			return state;
	}
}

function filter(state, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return state || {};
		case 'RESET_FILTERS':
			return {};
		case 'UPDATE_FILTER':
			var newState = {...state};
			if (action.value) {
				newState[action.name] = action.value;
			} else {
				delete newState[action.name];
			}
			return newState;
		default:
			return state || null;
	}
}

function viewdetail(state = {}, action) {
	switch(action.type){
		case 'INIT_MODULE':
			return {};
		case 'SET_ADMIN_JOB_VIEW_DATA':
			return action.data;
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {};
		case 'SET_JOB_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

const reducer = combineReducers({
	viewState,
	items,
	pageInfo,
	filter,
	errors,
	viewdetail
});

export default reducer;