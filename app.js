const inputTaskHtml = `<form class="input-task">
<div class="input-task__content">
  <div class="input-task__header">
    <h5>Today</h5>
    <p>Web 23 feb</p>
  </div>
  <div class="input-task__form">
    <div class="box-content">
      <input
        autocomplete="off"
        class="input task-title"
        type="text"
        name="task-title"
        id=""
        placeholder="Title"
      
      />
      <textarea
        class="input task-content"
        placeholder="Content"
        name="task-content"
        id=""
      
      ></textarea>
    </div>
    <div class="box-status">
      <input
        class="input-radio"
        type="radio"
        name="task-status"
        id="to-do"
        value="To Do"
      
      />
      <label for="to-do">To do</label>
      <input
        class="input-radio"
        type="radio"
        name="task-status"
        id="progress"
        value="In Progress"
      />
      <label for="progress">In Progress</label>
      <input
        class="input-radio"
        type="radio"
        name="task-status"
        id="completed"
        value="Completed"
      />
      <label for="completed">Completed</label>
    </div>
    <div class="box-date">
      <input type="date" name="task-date" id="" />
    </div>
  </div>
  <div class="input-task__submit">
    <button class="submit">Add task</button>
    <button class="cancel">Cancel</button>
  </div>
</div>
</form>`;

window.addEventListener("load", function () {
  const $ = this.document.querySelector.bind(this.document);
  const $$ = this.document.querySelectorAll.bind(this.document);
  let storage = [];
  const app = {
    getDataFromLS: function () {
      if (!localStorage.getItem("todolist")) {
        localStorage.setItem("todolist", JSON.stringify(storage));
      } else {
        storage = JSON.parse(localStorage.getItem("todolist"));
      }
    },
    renderTaskFromLS: function (
      creCb = function () {},
      numCb = function () {},
      activeCb = function () {}
    ) {
      storage.forEach((item) => {
        creCb(item, numCb, activeCb);
      });
    },
    openAddTask: function () {
      const addTaskBtns = [...$$(".add-task")];

      addTaskBtns.forEach((item) => {
        item.addEventListener("click", function () {
          document.body.insertAdjacentHTML("beforeend", inputTaskHtml);
          const toDay = $(".input-task__header p");
          toDay.textContent = new Date().toDateString();
        });
      });

      document.addEventListener("click", function (e) {
        if (e.target.matches(".cancel")) {
          const addTask = $(".input-task");
          document.body.removeChild(addTask);
        } else if (e.target.matches(".input-task")) {
          document.body.removeChild(e.target);
        }
      });
    },
    getInput: function (
      creCb = function () {},
      numCb = function () {},
      activeCb = function () {}
    ) {
      document.addEventListener("click", function (e) {
        if (e.target.matches(".submit")) {
          const form = $(".input-task");
          form.addEventListener("submit", function (e) {
            e.preventDefault();

            if (
              this.elements["task-title"].value &&
              this.elements["task-content"].value &&
              this.elements["task-status"].value &&
              this.elements["task-date"].value
            ) {
              const task = {
                title: this.elements["task-title"].value,
                content: this.elements["task-content"].value,
                status: this.elements["task-status"].value,
                date: this.elements["task-date"].value,
                id: Math.random().toString(),
              };
              storage.push(task);
              localStorage.setItem("todolist", JSON.stringify(storage));
              creCb(task, numCb, activeCb);
              document.body.removeChild(this);
            } else {
              alert("nhap cho du vao");
              document.body.removeChild(this);
              document.body.insertAdjacentHTML("beforeend", inputTaskHtml);
            }
          });
        }
      });
    },
    createNewTask: function (task, numCb, activeCb) {
      const newDate = new Date(task.date);
      const dateString = newDate.toLocaleDateString("vi-VI");

      const taskHtml = `<div class="todolist-task">
      <div class="accordion">
        <div class="accordion-header" data-id="${task.id}">
          <span>${task.title}</span>
          <div class="header__status">
            <button
              class="status-btn status-todo"
              data-tus="To Do"
            ></button>
            <button
              class="status-btn status-progress"
              data-tus="In Progress"
            ></button>
            <button
              class="status-btn status-completed"
              data-tus="Completed"
            ></button>
          </div>
          <i class="fas fa-angle-down icon"></i>
        </div>
        <div class="accordion-content">
          <div class="accordion-content-inner">
            <h4>${task.title}</h4>
            <p>${task.content}</p>
            <div class="deadline-task">
              <h4>${dateString}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>`;
      const listTasks = [...$$(".todolist-box__tasks")];
      listTasks.forEach((item) => {
        const statusString = item.getAttribute("data-status");
        if (statusString === task.status) {
          setTimeout(function () {
            item.insertAdjacentHTML("beforeend", taskHtml);
            numCb();
            activeCb();
          }, 200);
        }
      });
    },
    showMoreTask: function () {
      document.addEventListener("click", function (e) {
        const tasks = [...$$(".accordion-header")];
        if (e.target.matches(".accordion-header")) {
          tasks.forEach((item) => {
            if (
              item.getAttribute("data-id") === e.target.getAttribute("data-id")
            ) {
              if (item.classList.contains("is-active")) {
                setTimeout(function () {
                  item.classList.toggle("is-active");
                }, 250);
              } else {
                item.classList.toggle("is-active");
              }

              const content = item.nextElementSibling;
              content.style.height = `${content.scrollHeight}px`;
              content.classList.toggle("is-active");
              if (!content.classList.contains("is-active")) {
                content.style.height = `0px`;
              }
              item
                .querySelector(".accordion-header i")
                .classList.toggle("fa-angle-down");
              item
                .querySelector(".accordion-header i")
                .classList.toggle("fa-angle-up");
            }
          });
        }
      });
    },
    countTasks: function () {
      const taskListBoxs = [...$$(".content-todolist-box")];
      taskListBoxs.forEach((item) => {
        const headerBox = item.querySelector(".todolist-box__header");
        const numTasksElement = headerBox.querySelector(".num-of-task");
        const numTasks = [...item.querySelectorAll(".todolist-task")].length;

        numTasksElement.textContent = `${numTasks}`;
      });
    },
    activeBtnStatus: function () {
      const listBoxs = [...$$(".todolist-box__tasks")];
      listBoxs.forEach((listBox) => {
        const taskBoxs = [...listBox.querySelectorAll(".todolist-task")];
        taskBoxs.forEach((taskBox) => {
          const statusBtns = [...taskBox.querySelectorAll(".status-btn")];
          statusBtns.forEach((i) => {
            const check =
              i.getAttribute("data-tus") ===
              listBox.getAttribute("data-status");
            if (check) {
              i.classList.add("status-btn-is-active");
            } else {
              i.classList.remove("status-btn-is-active");
            }
          });
        });
      });
    },
    switchStatusEvent: function (switchCb, activeCb, numCb) {
      document.addEventListener("click", function (e) {
        if (e.target.matches(".status-btn")) {
          switchCb(e.target, activeCb, numCb);
        }
      });
    },
    switchHandle: function (buttonNode, activeCb, numCb) {
      const taskBoxTodo = $(".todo-box");
      const taskBoxProgress = $(".progress-box");
      const taskBoxCompleted = $(".completed-box");

      const taskHeader = buttonNode.parentNode.parentNode;
      const taskSwitch = buttonNode.parentNode.parentNode.parentNode.parentNode;
      const switchStatusString = buttonNode.getAttribute("data-tus");

      const taskId = taskHeader.getAttribute("data-id");

      setTimeout(function () {
        switchTask();
      }, 150);

      function switchTask() {
        if (switchStatusString === "To Do") {
          taskBoxTodo.insertAdjacentElement("beforeend", taskSwitch);
          updateLS("To Do");
        } else if (switchStatusString === "In Progress") {
          taskBoxProgress.insertAdjacentElement("beforeend", taskSwitch);
          updateLS("In Progress");
        } else if (switchStatusString === "Completed") {
          taskBoxCompleted.insertAdjacentElement("beforeend", taskSwitch);
          updateLS("Completed");
        }
        activeCb();
        numCb();
      }

      function updateLS(statusString) {
        storage.forEach((item) => {
          const { id } = item;
          if (`${id}` === taskId) {
            item.status = statusString;
          }
        });
        localStorage.setItem("todolist", JSON.stringify(storage));
      }
    },
    activeBtnMenuB: function (switchBoxCb) {
      const btns = [...$$(".bottom-menu-mb button")];

      btns.forEach((item) => {
        item.addEventListener("click", function (e) {
          switchBoxCb(item);

          e.target.querySelector("i").classList.add("is-active");
          e.target.querySelector("h5").classList.add("is-active");
          const btns = [...$$(".bottom-menu-mb button")];
          btns.forEach((i) => {
            if (i !== e.target) {
              i.querySelector("i").classList.remove("is-active");
              i.querySelector("h5").classList.remove("is-active");
            }
          });
        });
      });
    },
    switchTaskList: function (buttonNode) {
      const listTypeClass = buttonNode.getAttribute("data-tus");

      const taskListBoxs = [...$$(".content-todolist-box")];
      taskListBoxs.forEach((item) => {
        if (item.classList.contains(listTypeClass)) {
          item.classList.add("is-show-listTask");
          item.classList.remove("is-close-listTask");
        } else {
          item.classList.add("is-close-listTask");
          item.classList.remove("is-show-listTask");
        }
      });
    },
    run: function () {
      _this = this;

      _this.getDataFromLS();
      _this.renderTaskFromLS(
        _this.createNewTask,
        _this.countTasks,
        _this.activeBtnStatus
      );
      _this.openAddTask();
      _this.getInput(
        _this.createNewTask,
        _this.countTasks,
        _this.activeBtnStatus
      );
      _this.showMoreTask();
      _this.switchStatusEvent(
        _this.switchHandle,
        _this.activeBtnStatus,
        _this.countTasks
      );
      _this.activeBtnMenuB(_this.switchTaskList);
    },
  };
  app.run();
});
