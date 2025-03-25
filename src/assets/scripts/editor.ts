const image = document.getElementById("img") as HTMLInputElement;
const sendBtn = document.getElementById("send-btn");
const file = image.files ? image.files[0] : null;
let outputImage = "";

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  ["link", "image", "formula"],
  [{ header: 1 }, { header: 2 }, { header: 3 }],
  [{ align: [] }],
  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  ["clean"], // remove formatting button
];

const editor = new Quill("#editor", {
  theme: "snow",
  modules: {
    toolbar: toolbarOptions,
  },
});

new QuillMarkdown(editor);

document.addEventListener("DOMContentLoaded", () => {
  editor.on("text-change", () => {
    console.log(editor.root.innerHTML);
  });

  image?.addEventListener("change", () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const base64 = e.target?.result;
        if (base64) {
          const output = document.getElementById("imageOutput");
          outputImage = base64 as string;
          output.src = base64;
          output.style.display = "block";
        }
      };
      reader.readAsDataURL(file);
    }
  });

  sendBtn?.addEventListener("click", async () => {
    const formData = new FormData();
    const editor = document.querySelector(".ql-editor");
    const title = (document.getElementById("title") as HTMLInputElement)?.value;
    const author = (document.getElementById("author") as HTMLInputElement)
      ?.value;
    const description = (
      document.getElementById("description") as HTMLInputElement
    )?.value;
    const tags = (document.getElementById("tags") as HTMLInputElement)?.value;
    const links = (document.getElementById("links") as HTMLInputElement)?.value;
    const mainTag = (document.getElementById("main-tag") as HTMLInputElement)
      ?.value;
    const authorDescription = (
      document.getElementById("author-description") as HTMLInputElement
    )?.value;
    const content = editor ? editor.innerHTML : "";
    const file = image?.files && image?.files[0];
    const imageType = file?.type.split("/")[1];

    if (file) {
      formData.append("file", file);
      formData.append("filename", `${title}.${imageType}`);
    }

    const uploadImageResponse = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    if (!uploadImageResponse.ok) {
      alert("Erro ao fazer upload da imagem");
      return;
    }

    const mainRequestResult = await fetch("http://localhost:3000/create-md", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        author,
        description,
        tags: tags.split(","),
        links,
        primaryTag: mainTag,
        authorDescription,
        content,
        imageName: `${title}.${imageType}`,
      }),
    });

    if (mainRequestResult.ok) {
      alert("Post criado com sucesso!");
    } else {
      console.error(mainRequestResult);
      alert("Erro ao criar post");
    }
  });
});
