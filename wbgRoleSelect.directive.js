'use strict';

/**
 * @ngdoc directive
 * @name wbgAdminApp.directive:wbgRoleSelect
 * @description
 * 选择角色组下的角色
 */

 angular.module("App")
 	.directive("wbgRoleSelect", [function () {
 		return {
 			restrict: 'A',
 			require: 'ngModel',
 			template: '\
 			<div class="wbg-role-select">\
 				<div class="wbg-select-tags" ng-click="fn.dropdownShow()">\
 				<div ng-if="data.hasdisabled" class="wbg-select-disabled"></div>\
 				<span ng-if="data.multiple==1 && data.selectItems.length!=0" class="tags-multiple"\
 				ng-repeat="item in data.selectItems">{{item.role}}\
 				  <i class="item-rm" ng-click="fn.itemRemove(item, $event)"></i>\
 				</span>\
 				<span ng-if="data.multiple==0 && data.selectItems" class="tags-no-multiple text-cut tags-single">{{data.selectItems}}</span>\
	    		<span ng-if="!(data.multiple==1 && data.selectItems.length!=0 || data.multiple==0 && data.selectItems)" class="tags-no-multiple wbg-txt hint">请选择审批角色</span>\
	    		<i class="wbg-icon-font wbg-icon-drop-down-12px icon-s12 drop-down-arrow"></i>\
 				<div>\
 			<div>',
 			scope: {
 				allItems: '=allItems',
 				multiple: '@multiple',
 				isdisabled: '=isdisabled'
 			},
 			link: function (scope, element, attr, ctrl) {
 				var data = scope.data = scope,
 				    fn = scope.fn = {},
 				    roleIdNameMap;
 				    //options = {};
 				var dataD = [
 					{
 						id: 11,
 						name: "岗位1",
 						roleDetails: [
 							{
 								id: 111,
 								name: "财务1",
 								parentId: 11
 							},{
 								id: 112,
 								name: "行政1",
 								parentId: 11
 							},{
 								id: 113,
 								name: "人事1",
 								parentId: 11
 							}
 						]
 					},{
 						id: 12,
 						name: "岗位2",
 						roleDetails: [
 							{
 								id: 121,
 								name: "财务2",
 								parentId: 12
 							},{
 								id: 122,
 								name: "行政2",
 								parentId: 12
 							},{
 								id: 123,
 								name: "人事2",
 								parentId: 12
 							}
 						]
 					},{
    					id: 13,
    					name: "岗位3",
    					roleDetails: [
 							{
 								id: 131,
 								name: "财务3",
 								parentId: 13
 							},{
 								id: 132,
 								name: "行政3",
 								parentId: 13
 							},{
 								id: 133,
 								name: "人事3",
 								parentId: 13
 							}
 						]
 					}
 				]
 				// var _setOptionsByAttr = function () {
 				// 	angular.forEach(['multiple'], function (key) {
 				// 		if (angular.isDefined(attr[key])) {
 				// 			options[key] = attr[key];
 				// 		}
 				// 	})
 				// }
 				//获取角色的id与name映射值
 				var _getRoleIdNameMap = function (origindata) {
 					var idNameMap = {};
 					angular.forEach(origindata, function (item) {
 						angular.forEach(item.roleDetails, function (subitem) {
 							idNameMap[subitem.id] = subitem.name;
 						})
 					})
 					return idNameMap;
 				}

 				var _initData = function () {
 					data.allRoleG = dataD;
 					roleIdNameMap = _getRoleIdNameMap(dataD);

 					//_setOptionsByAttr();

 				}
 				var _bindEvent = function () {
 					angular.element('body').on('click', function ($event) {
 						var $target = angular.element($event.target);
 						if ($target.closest('.wbg-role-select .wbg-select-tags').length == 0 && $target.closest('.wbg-role-select .wbg-select-dropdown').length == 0) {
 							scope.$apply(function () {
 								data.showDropdown = false;
 							})
 						}
 					})
 				}
 				
 				//启用或禁用模式
 				var _switchSelectMode = function () {
 					scope.$watch('isdisabled',function(newValue){
 						if (newValue.value == 1) {
 							data.hasdisabled = true;
 							data.showDropdown = false;
 						}
 						if(newValue.value == 0) {
 							data.hasdisabled = false;
 						}
 					}, true)
 				}

 				var _init = function () {
 					_initData();
 					_bindEvent();
 					_switchSelectMode();
 				}
 				_init();

 				//根据角色ids获取对应的角色
 				var _getSelectItemByIds = function (ids) {
 					var type = typeof ids,
 						selectItems,
 						i;
 					if (!ids || Array.isArray(ids) && ids.length == 0) return false;
 					if (!(type === "string" || type ==="number" || type === "object" && Array.isArray(ids))) return false;

 					

 					if (data.multiple == 0) {
 						return selectItems = roleIdNameMap[ids];
 					}
 					if(data.multiple == 1) {
 						selectItems = [];
 						for(i = 0; i < ids.length; i++) {
 							selectItems.push({id: ids[i], role: roleIdNameMap[ids[i]]});
 						}
 					}
 					return selectItems;

 				}
 				
 				fn.dropdownShow = function () {
 					alert(2)
 					if (data.hasdisabled) return;
 					data.showDropdown = !data.showDropdown;
 				}
 				fn.roleGroupItemClick = function (roleGroupItem) {
 					roleGroupItem.showRoleItem = !roleGroupItem.showRoleItem;
 				}
 				fn.roleItemClick = function (roleItem) {
 					if (data.multiple == 1) {
 						roleItem.selected = !roleItem.selected;
 						if (roleItem.selected) {
	 						data.selectItems.push({id: roleItem.id, role: roleItem.name});
	 					} else {
	 						angular.forEach(data.selectItems, function (item, index) {
	 							if (item.id == roleItem.id) {
	 								data.selectItems.splice(index, 1);
	 							}
	 						})
	 					}
 					}
 					if (data.multiple == 0) {
 						data.selectItems = roleIdNameMap[roleItem.id];
 						data.showDropdown = false;
 					}
 					
 					
 				}
 				fn.itemRemove = function (item, $event) {
 					$event.stopPropagation();
 					angular.forEach(data.selectItems, function (selectItem, index) {
 						if (item.id == selectItem.id) {
 							data.selectItems.splice(index, 1);
 						}
 					})
 				}
 				//$formatters接受一个数组，数组是一系列方法，用于将modelValue转化成viewValue
 				ctrl.$formatters.push(function (modelValue) {
 					var selectItems = _getSelectItemByIds(modelValue);
 					if (!selectItems) return '';
 					return selectItems;
 				})

 				ctrl.$render = function () {
 					data.selectItems = ctrl.$viewValue;
 				}

 				//data.selectItems变化时，更新$viewValue
 				scope.$watch('data.selectItems', function () {
 					ctrl.$setViewValue(data.selectItems);
 				}, true)

 				//通过$parsers将$viewValue转化为$modelValue
 				ctrl.$parsers.push(function (viewValue) {
 					var selectIdArray = [];
 					angular.forEach(viewValue, function (item) {
 						selectIdArray.push(item.id);
 					})
 					return selectIdArray;
 				})
 			}
 		}
 	}])
console.log(angular.module("App"));