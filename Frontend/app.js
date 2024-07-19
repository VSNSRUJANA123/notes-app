$(document).ready(() => {
  const API_URL = "https://notes-backend-1-cs4r.onrender.com/api";

  const fetchNotes = () => {
    $.ajax({
      url: `${API_URL}/notes`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      success: (notes) => {
        $("#notes").empty();
        notes.forEach((note) => {
          $("#notes").append(`
            <div class="note" style="background-color: ${note.color};">
              <h3>${note.title}</h3>
              <p>${note.content}</p>
              <small>Tags: ${note.tags.join(", ")}</small>
            </div>
          `);
        });
      },
      error: (err) => {
        console.error("Error fetching notes:", err);
      },
    });
  };

  const showModal = (modalId) => {
    $(`#${modalId}`).css("display", "block");
  };

  const closeModal = () => {
    $(".modal").css("display", "none");
  };

  function showToast(message) {
    const toast = $(`
    <div class="toast" style="
      background-color: #333;
      color: #fff;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 10px;
      opacity: 0.9;
    ">
      ${message}
    </div>
  `);

    $("#toast-container").append(toast);

    setTimeout(() => {
      toast.fadeOut(400, () => {
        toast.remove();
      });
    }, 3000);
  }

  $("#login-btn").click(() => showModal("login-modal"));
  $("#register-btn").click(() => showModal("register-modal"));

  $(".close").click(() => closeModal());

  $("#save-note").click(() => {
    const token = localStorage.getItem("token");
    const title = $("#title").val();
    const content = $("#content").val();
    const tags = $("#tags")
      .val()
      .split(",")
      .map((tag) => tag.trim());
    const color = $("#color").val();

    $.ajax({
      url: `${API_URL}/notes`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({
        title,
        content,
        tags,
        color,
      }),
      success: (note) => {
        $("#title").val("");
        $("#content").val("");
        $("#tags").val("");
        $("#color").val("#ffffff");
        fetchNotes();
      },

      error: (err) => {
        console.log("token", token);
        if (token === null) {
          showToast("!Please login user");
        } else {
          showToast("Must Enter the title and content");
        }
        console.error("Error saving note:", err);
      },
    });
  });

  $("#search").keyup(() => {
    const query = $("#search").val().toLowerCase();
    $(".note").each(function () {
      const note = $(this);
      const title = note.find("h3").text().toLowerCase();
      const content = note.find("p").text().toLowerCase();
      if (title.includes(query) || content.includes(query)) {
        note.show();
      } else {
        note.hide();
      }
    });
  });
  $("#profile-section").hide();
  $("login-btn-container").show();
  updateUI();
  function updateUI() {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (token) {
      $("#login-btn").hide();
      $("#register-btn").hide();
      $("#profile-section").show();
      $("#username").text(username);
    } else {
      $("#login-btn").show();
      $("#register-btn").show();
      $("#profile-section").hide();
    }
  }

  $("#login-submit").click(() => {
    const email = $("#login-email").val();
    const password = $("#login-password").val();
    $.ajax({
      url: `${API_URL}/users/login`,
      method: "POST",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({
        email,
        password,
      }),
      success: (response) => {
        localStorage.setItem("token", response.token);
        updateUI();
        closeModal();
        fetchNotes();
        showToast("login successfully");
      },
      error: (err) => {
        showToast("invalid data");
        console.error("Error logging in:", err);
      },
    });
  });

  $("#register-submit").click(() => {
    const username = $("#register-username").val();
    const email = $("#register-email").val();
    const password = $("#register-password").val();

    $.ajax({
      url: `${API_URL}/users/register`,
      method: "POST",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({
        username,
        email,
        password,
      }),
      success: (response) => {
        localStorage.setItem("username", username);
        showToast("user register successfully");
        closeModal();
      },
      error: (err) => {
        showToast("invalid data");
        console.error("Error registering:", err);
      },
    });
  });

  fetchNotes();
});
