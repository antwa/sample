<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Laravel</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet" type="text/css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js"></script>
        <link href="/js/devextreme/dist/css/dx.common.css" rel="stylesheet" type="text/css">
        <link href="/js/devextreme/dist/css/dx.greenmist.css" rel="stylesheet" type="text/css">
        <script src="/js/devextreme/dist/js/dx.all.js"></script>




        <!-- Styles -->
        <style>
            html, body {
                background-color: #fff;
                color: #636b6f;
                font-family: 'Nunito', sans-serif;
                font-weight: 200;
                height: 100vh;
                margin: 0;
            }
            .links > a {
                color: #636b6f;
                padding: 0 25px;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: .1rem;
                text-decoration: none;
                text-transform: uppercase;
            }

        </style>
    </head>
    <body>
    <div class="demo-container">
        <form  id="form-container">
            <div id="form"></div>

        </form>

        <div id="dataGrid"></div>
        <div id="save"></div>

    </div>
    <script>
        $(function() {
            $.fn.serializeObject = function()
            {
                var o = {};
                var a = this.serializeArray();
                $.each(a, function() {
                    if (o[this.name] !== undefined) {
                        if (!o[this.name].push) {
                            o[this.name] = [o[this.name]];
                        }
                        o[this.name].push(this.value || '');
                    } else {
                        o[this.name] = this.value || '';
                    }
                });
                return o;
            };
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            var employee = [{
                "ID": 1,
                "Nama": "Bagus",
                "Alamat": "Bogor",
                "TanggalLahir": "1988/06/04",
                "JenisKelamin": "LAKI-LAKI",
            },{
                "ID": 2,
                "Nama": "Wahyu",
                "Alamat": "Bogor",
                "TanggalLahir": "1988/04/30",
                "JenisKelamin": "LAKI-LAKI",
            },
            ];

            var jeniskelamin = [
                "LAKI-LAKI",
                "PEREMPUAN",

            ];

            $("#save").dxButton({
                text: "Save",
                type: "normal",
                width: 90,
                onClick: function(e) {
                    var data = dataGrid.getDataSource().items();
                    var form =$('#form-container').serializeObject();
                    var postdata = [];

                    console.log(JSON.stringify(form));
                    $.ajax({
                        type: "POST",
                        url: "{{route('save')}}",
                        data: JSON.stringify({ form: form,table:data}),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function(data){alert(data);},
                        failure: function(errMsg) {
                            alert(errMsg);
                        }
                    });
                }
            });
            var form =$("#form").dxForm({
                formData: employee,
                items: [{
                    itemType: "group",
                    cssClass: "first-group",
                    colCount: 1,
                    items: [{
                        template: "<div class='form-avatar'></div>"
                    }, {
                        itemType: "group",
                        colSpan: 3,
                        items: [{
                            dataField: "Nama"

                        }, {
                            dataField: "TanggalLahir",
                            editorType: "dxDateBox",
                            editorOptions: {
                                width: "150px"
                            }
                        }]
                    }]
                }, {
                    itemType: "group",
                    cssClass: "second-group",
                    colCount: 2,
                    items: [{
                        itemType: "group",
                        items: [{
                            dataField: "Alamat"
                        }, {
                            dataField: "JenisKelamin",
                            editorType: "dxSelectBox",
                            editorOptions: {
                                items: jeniskelamin,
                                value: ""
                            }
                        }]
                    }, ]
                }]
            }).dxForm("instance");
            var dataGrid =$("#dataGrid").dxDataGrid({
                dataSource: employee,
                keyExpr: "ID",
                showBorders: true,
                paging: {
                    enabled: false
                },
                editing: {
                    // nih mode
                    // popup = modal
                    // row = inline
                    mode: "row",
                    allowUpdating: true,
                    allowDeleting: true,
                    allowAdding: true,

                },
                columns: [
                    {
                        dataField: "ID",
                        caption: "#ID"
                    },
                    "Nama",
                    "Alamat",
                    {
                        dataField: "TanggalLahir",
                        caption:"Tanggal Lahir",
                        dataType: "date",

                    },
                    {
                        dataField: "JenisKelamin",
                        caption: "Jenis Kelamin",
                        width: 125,
                        lookup: {
                            dataSource: jeniskelamin,

                        }
                    },
                ],
            }).dxDataGrid("instance");;
        });
    </script>
    </body>
</html>
