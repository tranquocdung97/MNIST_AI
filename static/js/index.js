document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        loadText();
        $(".input-file").before(
            function () {
                if (!$(this).prev().hasClass('input-ghost')) {
                    var element = $("<input type='file' id='file_load' class='input-ghost' accept='.jpg, .png' style='visibility:hidden; height:0'>");
                    element.attr("name", $(this).attr("name"));
                    element.change(function () {
                        element.next(element).find('input').val((element.val()).split('\\').pop());
                    });
                    $(this).find("button.btn-choose").click(function () {
                        element.click();
                    });
                    return element;
                }
            }
        );
    }
}
function loadText() {
    var btn_upfile = document.getElementById("btn_upfile");
    var txt_choose = document.getElementById("txt_choose");
    var btn_choose = document.getElementById("btn_choose");
    var txt_title = document.getElementById("txt_title");
    var txt_title_form = document.getElementById("txt_title_form");
    var txt_title_result = document.getElementById("txt_title_result");
    var img_upload = document.getElementById("img_upload");
    var txt_result = document.getElementById("txt_result");
    btn_upfile.innerHTML = "Tải lên";
    txt_choose.placeholder = "Vui lòng chọn file ảnh...";
    btn_choose.innerHTML = "Chọn tệp";
    txt_title.innerHTML = "DỰ ĐOÁN CHỮ SỐ TRONG HÌNH";
    txt_title_form.innerHTML = "DỰ ĐOÁN CHỮ SỐ TRONG HÌNH";
    txt_title_result.innerHTML = "KẾT QUẢ DỰ ĐOÁN";
    txt_title_result.hidden = true;
    img_upload.hidden = true;
    txt_result.hidden = true;

}
function upLoad() {
    var file_load = document.getElementById("file_load").files[0];
    var txt_title_result = document.getElementById("txt_title_result");
    var img_upload = document.getElementById("img_upload");
    var txt_result = document.getElementById("txt_result");
    var txt_success_upload = document.getElementById("txt_success_upload");
    var formData = new FormData();
    formData.append('file', file_load);
    $.ajax({
        xhr: function () {
            var xhr = new window.XMLHttpRequest();

            xhr.upload.addEventListener('progress', function (e) {

                if (e.lengthComputable) {

                    console.log('Bytes Loaded: ' + e.loaded);
                    console.log('Total Size: ' + e.total);
                    console.log('Percentage Uploaded: ' + (e.loaded / e.total))

                    var percent = Math.round((e.loaded / e.total) * 100);
                    if (percent >= 100)
                        $('#loadbar_upload').attr('aria-valuenow', percent).css('width', percent + '%').text('Upload Successfull !');
                    else
                        $('#loadbar_upload').attr('aria-valuenow', percent).css('width', percent + '%').text(percent + '%');

                }

            });

            return xhr;
        },
        url: "/upload",
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function (data_upload) {
            txt_title_result.hidden = false;
            img_upload.hidden = false;
            txt_result.hidden = false;
            if (data_upload['status'] == 'success') {
                $.ajax({
                    url: "/predict/" + data_upload['name_file_up'],
                    type: 'GET',
                    success: function (data_predict) {
                        if (data_predict['status'] == "success") {
                            img_upload.src = data_predict['url_file'];
                            txt_result.innerHTML = "Số " + data_predict['result_predict']
                        }

                    }
                });

            }
        }
    });
}
