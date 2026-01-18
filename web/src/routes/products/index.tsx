import { ChangeEvent, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { RxImage } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { CreateProductDetails, useCreateProductMutate } from "../../hooks/useCreateProductMutate";
import { userStore } from "../../store/userStore";
import {
  ErrorMessage,
  ImageUploadButton,
  Input,
  InputContainer,
  Label,
  ProductForm,
  ProductImageContainer,
  ProductImagePreview,
  ProductsContent,
  RemoveImageButton,
  SubmitButton,
  SuccessMessage,
  TextArea,
} from "./styles";

export default function Products() {
  const navigate = useNavigate();
  const userInfo = userStore((state) => state.user);
  const { mutate, isSuccess, isError, reset } = useCreateProductMutate();
  const [productData, setProductData] = useState<CreateProductDetails>({
    name: "",
    description: "",
    category: "",
    unit_value: "",
    stock: "",
  });
  const [productImage, setProductImage] = useState<File[] | null>();
  const [imagePreview, setImagePreview] = useState<string | null>();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!userInfo?.token) {
      navigate("/login");
    } else if (userInfo.role !== "ADMIN") {
      navigate("/");
    }
  }, [userInfo, navigate]);

  function onDropProductImage(acceptedFiles: File[]) {
    const file = acceptedFiles[0];
    setProductImage([file]);
    setImagePreview(URL.createObjectURL(file));
    setErrorMessage("");
  }

  const productImageUpload = useDropzone({
    onDrop: onDropProductImage,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
  });

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!productData.name.trim()) {
      setErrorMessage("Nome do produto é obrigatório");
      return;
    }

    if (!productImage || productImage.length === 0) {
      setErrorMessage("Imagem do produto é obrigatória");
      return;
    }

    mutate({
      data: productData,
      file: productImage,
    });
  }

  function handleRemoveImage() {
    setProductImage(null);
    setImagePreview(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  }

  function handleReset() {
    setProductData({
      name: "",
      description: "",
      category: "",
      unit_value: "",
      stock: "",
    });
    setProductImage(null);
    setImagePreview(null);
    setErrorMessage("");
    reset();
  }

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        handleReset();
      }, 3000);
    }
  }, [isSuccess]);

  return (
    <ProductsContent>
          <h1>Criar Novo Produto</h1>
          <p>Preencha os dados do produto abaixo</p>

          <ProductForm onSubmit={handleSubmit}>
            <ProductImageContainer>
              {imagePreview ? (
                <ProductImagePreview>
                  <img src={imagePreview} alt="Preview" />
                  <RemoveImageButton type="button" onClick={handleRemoveImage}>
                    ×
                  </RemoveImageButton>
                </ProductImagePreview>
              ) : (
                <ImageUploadButton
                  {...productImageUpload.getRootProps()}
                >
                  <input {...productImageUpload.getInputProps()} />
                  <RxImage size={48} />
                  <span>Clique ou arraste a imagem aqui</span>
                  <small>PNG, JPG, GIF até 10MB</small>
                </ImageUploadButton>
              )}
            </ProductImageContainer>

            <InputContainer>
              <Label htmlFor="name">
                Nome do Produto <span>*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={productData.name}
                onChange={handleInputChange}
                placeholder="Ex: Notebook Gamer"
                required
              />
            </InputContainer>

            <InputContainer>
              <Label htmlFor="description">Descrição</Label>
              <TextArea
                id="description"
                name="description"
                value={productData.description}
                onChange={handleInputChange}
                placeholder="Descreva o produto..."
                rows={4}
              />
            </InputContainer>

            <InputContainer>
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                name="category"
                type="text"
                value={productData.category}
                onChange={handleInputChange}
                placeholder="Ex: Eletrônicos, Roupas, etc."
              />
            </InputContainer>

            <div style={{ display: "flex", gap: "1rem" }}>
              <InputContainer style={{ flex: 1 }}>
                <Label htmlFor="unit_value">Valor Unitário (R$)</Label>
                <Input
                  id="unit_value"
                  name="unit_value"
                  type="number"
                  step="0.01"
                  min="0"
                  value={productData.unit_value}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </InputContainer>

              <InputContainer style={{ flex: 1 }}>
                <Label htmlFor="stock">Estoque</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={productData.stock}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </InputContainer>
            </div>

            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            {isError && (
              <ErrorMessage>Erro ao criar produto. Tente novamente.</ErrorMessage>
            )}
            {isSuccess && (
              <SuccessMessage>Produto criado com sucesso!</SuccessMessage>
            )}

            <SubmitButton type="submit">Criar Produto</SubmitButton>
          </ProductForm>
    </ProductsContent>
  );
}
