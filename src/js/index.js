import '../css/reset.css'
import '../css/index.styl'
import '../../node_modules/jquery-datetimepicker/build/jquery.datetimepicker.min.css'
import '../../node_modules/jquery-datetimepicker/build/jquery.datetimepicker.full.min'

(function () {
  let $formBtnSubmit = $('.btn-submit');
  let $fromAddInput = $('.add-task-text');
  let $taskDescModal = $('.task-desc-modal');
  let $taskDescShade = $('.task-desc-shade');
  let $taskDescClose = $('.task-desc-close');
  let $taskDescOk = $('.task-desc-ok');
  let $taskDescTitle = $('.task-desc-title');
  let $taskDescTextarea = $('.desc-textarea');
  let remindDateCur = $('.remind-date');
  let $taskItem;
  let $fromDelItem;
  let $fromTaskItemDesc;
  let newAddTaskVal = {};
  let taskList = [];
  let currentIndex;
  let dateVal;
  let $taskChecked;


  init();

  // 给提交按钮绑定
  $formBtnSubmit.on('click', () => {
    addTask()
  })

  $fromAddInput.on('keyup', (e) => {
    e = window.event || e;
    if (e.keyCode == 13) {
      addTask()
    }
  })


  // 封装item的parent
  function itemParent(el) {
    let $this = $(el);
    let $item = $this.parent().parent();
    let index = $item.data('index');
    return index;
  }

  function listeningDelItem() {
    $fromDelItem.on('click', function () {
      if (confirm("您确定要删除这条信息吗？")) {
        deleteTaskItem(itemParent(this))
      }
    })
  }

  function listeningDouble() {
    $taskItem.on('dblclick', function () {
      let index = $(this).data('index');
      shadeShow(index);
    })
  }

  // 弹出层
  function listeningShade() {
    $fromTaskItemDesc.on('click', function () {
      shadeShow(itemParent(this))
    })
  }

  // 选中按钮
  function listeningChecked() {
    $taskChecked.on('click', function () {
      let index = itemParent(this);
      let isChecked = $(this).is(':checked');
      updateTask(index, isChecked);
    })
  }

  function updateTask(index, data) {
    if (index == undefined || !taskList[index]) {
      return;
    }
    taskList[index].isChecked = data;
    refreshTaskList();
  }

  function shadeShow(index) {
    if (index === undefined || !taskList[index]) {
      return
    }
    currentIndex = index;
    let taskListItemVal = taskList[index];
    $taskDescTitle.html(taskListItemVal.content);
    $taskDescTextarea.val(taskListItemVal.content);

    remindDateCur.val(taskListItemVal.date);
    $taskDescShade.show();
    $taskDescModal.show();
  }

  function shadeHide() {
    $taskDescShade.hide();
    $taskDescModal.hide();
    remindDateCur.val('');
  }

  // 关闭弹出层
  $taskDescClose.on('click', () => {
    shadeHide()
  });

  // 保存按钮
  $taskDescOk.on('click', function () {
    let remindDate = $('.remind-date').val();
    $taskDescTextarea = $('.desc-textarea');
    taskList[currentIndex].content = $taskDescTextarea.val();
    taskList[currentIndex].date = remindDate;
    refreshTaskList();
    shadeHide()
  });

  // 存入localStorage
  function addTask() {
    newAddTaskVal = {};
    newAddTaskVal.content = $fromAddInput.val();

    // 设置时间
    let nowDate = new Date();
    let nowMonth = nowDate.getMonth() + 1;
    let nowDay = nowDate.getDate();
    nowMonth = nowMonth < 10 ? '0' + nowMonth : nowMonth;
    nowDay = nowDay < 10 ? '0' + nowDay : nowDay;
    dateVal = nowDate.getFullYear() + '-' + nowMonth + '-' + nowDay;
    newAddTaskVal.date = dateVal;

    if (newAddTaskVal.content) {
      taskList.unshift(newAddTaskVal);
      refreshTaskList();
      $fromAddInput.val('')
    }
  }
  
  // 初始化taskList列表
  function init() {
    //store.clear();
    taskList = store.get('taskList') || [];
    if (taskList.length > 0) {
      renderTaskList()
    }
  }

  // 更新localStorage数据
  function refreshTaskList() {
    store.set('taskList', taskList);
    renderTaskList();
  }

  function renderTaskList() {
    let $taskList = $('.task-list');
    let checked = '';
    let unchecked = '';
    $taskList.html('');
    taskList.forEach((item, index) => {

        // 让选中的排最后面
        if (item.isChecked) {
          checked += rendTaskTpl(item, index)
        } else {
          unchecked += rendTaskTpl(item, index)
        }
    });
    $taskList.append(unchecked + checked);
    $fromDelItem = $('.task-item-del');
    $fromTaskItemDesc = $('.task-item-desc');
    $taskItem = $('.task-item');
    $taskChecked = $('.task-item-checked > input[type=checkbox]');
    listeningDelItem();
    listeningShade();
    listeningDouble();
    listeningChecked();
  }

  function rendTaskTpl(data, index) {
    if (!data || index == undefined) {
      return
    }

    // 判断复选框有没有被选择
    let ischecked = '';
    let ischeckedClass = '';
    if (data.isChecked) {
      ischecked = `checked=${data.isChecked}`;
      ischeckedClass = ' task-item-text-active'
    }

    let taskItemTpl = `
      <li class="task-item" data-index="${index}">
          <span class="task-item-checked">
              <input type="checkbox" ${ischecked} id="item-checked${index}">
          </span>
          <label for="item-checked${index}">
            <span class="task-item-text ${ischeckedClass}">${data.content}</span>
          </label>
          <div class="task-item-handle">
            <span class="task-item-del">删除</span>
            <span class="task-item-desc">查看更多</span>
          </div>
      </li>
    `;
  return taskItemTpl
  }

  function deleteTaskItem(index) {
    if (index == undefined) {
      return;
    }
    taskList.splice(index, 1);
    refreshTaskList()
  }
})()