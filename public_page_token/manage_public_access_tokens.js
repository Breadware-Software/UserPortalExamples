(function() {
    'use strict';

    angular
        .module('app.custom_manage_public_tokens', [])
  		.controller('CustomManagePublicTokensController', CustomManagePublicTokensController);

    CustomManagePublicTokensController.$inject = [
        '$window', '$http', '$filter', '$state',
        'SweetAlert', 'GlobalFunctions', 'SwitchTenant'];

    function CustomManagePublicTokensController($window, $http, $filter, $state, SweetAlert,
                                                GlobalFunctions, SwitchTenant) {
        var vm = this;


        vm.stringify = function(val) {
            return JSON.stringify(val);
        }


        var loadDeviceTableData = function () {

            var handle_error = function (reason) {
                console.log("error loading token list: ", reason);
                SweetAlert.swal("Error loading token list");
            }

            var handle_data = function (response) {
                vm.loaded = true;

                vm.table.data = response.data;
            }


            $http.get('/api/v2/public_tokens').then(handle_data, handle_error);
        }


        vm.generate_new_token = function() {
            $http.post('/api/v2/public_tokens/create').then(
                function() {
                    loadDeviceTableData();
                },
                function(reason) {
                    console.log("Error generating new token: ", reason);
                }
            );
        }

        vm.revoke_token = function(index) {
            var tok = vm.table.data[index].token;

            $http.delete('/api/v2/public_tokens/'+tok).then(
                function() {
                    loadDeviceTableData();
                },
                function(reason) {
                    console.log("Error revoking token: ", reason);
                }
            );
        }



        function loadPageInfo() {
            loadDeviceTableData();
        }

        function activate() {
            var table = {
                'name': 'Public Tokens',
                'header': ['Token'],
                'data': [],
                'fields': ['token']
            };

            vm.table = table;
            loadPageInfo();

        }

        activate();
    }
})();

