import {React, useEffect, useState} from "react";
import AuthService from "../services/AuthService";
import ConnectedLayout from "../layouts/ConnectedLayout";
import {Breadcrumb, Button, Modal, Pagination, Spinner, Table} from "flowbite-react";
import {HiHome, HiPencilAlt, HiTrash} from "react-icons/hi";
import ProductsService from "../services/ProductsService";
import AddProductModal from "../components/products/AddProductModal";

function Products() {

    var [currentPage, setCurrentPage] = useState(1);
    var [addProductModal, setAddProductModal] = useState(false);

    if (!AuthService.getCurrentUser()) {
        window.location.href = "/login";
    }

    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);

    /*useEffect(() => {
        console.log("The value changed : " + addProductModal);
    }, [addProductModal]);

    useEffect(() => {
        if (addProductModal) {
            const timer = setTimeout(() => {
                document.getElementById("modal").style.display = "block";
            }, 0);

            return () => clearTimeout(timer);
        } else {
            document.getElementById("modal").style.display = "none";
        }
    }, [addProductModal]);*/

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const response = await ProductsService.getProducts();
            setProducts(response.data);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handlePageChange = (event) => {
        setCurrentPage(event.target.value);
    }

    const onAddProductButton = () => {
        setAddProductModal(true)
    }

    const onAddProduct = () => {

    }

    const onCloseAddProductModal = () => {
        setAddProductModal(false);
    }

    var totalPages = Math.ceil(products.length / 10);

    function paginate(array, page_size, page_number) {
        // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
        return array.slice((page_number - 1) * page_size, page_number * page_size);
    }


    return (<ConnectedLayout>
            <div className="flex-grow dark:bg-gray-800 ">
                <div
                    className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <Breadcrumb
                            className="pb-3"
                        >
                            <Breadcrumb.Item
                                href="/dashboard"
                                icon={HiHome}
                            >
                                Tableau de bord
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                Produits
                            </Breadcrumb.Item>
                        </Breadcrumb>
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Produits</h1>
                    </div>
                    <div className="block items-center justify-between space-y-2 sm:space-y-0 sm:flex">
                        <div>
                            <form className="flex items-center w-96">
                                <label htmlFor="simple-search" className="sr-only">Rechercher un produit</label>
                                <div className="relative w-full">
                                    <div
                                        className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                             fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd"
                                                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                  clip-rule="evenodd"></path>
                                        </svg>
                                    </div>
                                    <input type="text" id="simple-search"
                                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                           placeholder="Rechercher un produit" required/>
                                </div>
                                <button type="submit"
                                        className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                    <span className="sr-only">Rechercher</span>
                                </button>
                            </form>
                        </div>
                        <div>
                            <>
                            {/*<Button
                                    onClick={onAddProductButton}
                                >
                                    Ajouter un produit
                                </Button>

                                {addProductModal ? (<Modal
                                    id="modal"
                                    show={true}
                                    onClose={onCloseAddProductModal}
                                >
                                    <Modal.Header>
                                        Ajouter un produit
                                    </Modal.Header>
                                    <Modal.Body>
                                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                            <div><label className="text-sm font-medium text-gray-900 dark:text-gray-300"
                                                        htmlFor="productName">Libelle</label>
                                                <div className="flex mt-1">
                                                    <div className="relative w-full"><input
                                                        className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 rounded-lg p-2.5 text-sm"
                                                        id="productName" name="productName"
                                                        placeholder="Betterave crue"/></div>
                                                </div>
                                            </div>
                                            <div><label className="text-sm font-medium text-gray-900 dark:text-gray-300"
                                                        htmlFor="category">Type</label>
                                                <div className="flex mt-1">
                                                    <div className="relative w-full"><input
                                                        className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 rounded-lg p-2.5 text-sm"
                                                        id="category" name="category" placeholder="Légumes"/></div>
                                                </div>
                                            </div>
                                            <div><label className="text-sm font-medium text-gray-900 dark:text-gray-300"
                                                        htmlFor="brand">TVA</label>
                                                <div className="flex mt-1">
                                                    <div className="relative w-full"><input
                                                        className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 rounded-lg p-2.5 text-sm"
                                                        id="brand" name="brand" placeholder="5%"/></div>
                                                </div>
                                            </div>
                                            <div><label className="text-sm font-medium text-gray-900 dark:text-gray-300"
                                                        htmlFor="price">Prix</label>
                                                <div className="flex mt-1">
                                                    <div className="relative w-full"><input
                                                        className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 rounded-lg p-2.5 text-sm"
                                                        id="price" name="price" type="number" placeholder="3 €"/></div>
                                                </div>
                                            </div>
                                            <div className="lg:col-span-2"><label
                                                className="text-sm font-medium text-gray-900 dark:text-gray-300"
                                                htmlFor="producTable.Celletails">Description</label><textarea
                                                className="block w-full text-sm p-4 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 mt-1"
                                                id="producTable.Celletails" name="producTable.Celletails"
                                                placeholder="Betterave rouge crue, vendue à la pièce ou par 500g, origine France, certifiée AB, cultivée par le GAEC de la Garenne à Sainte Pazanne (44)."
                                                rows="6"></textarea></div>
                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button onClick={onAddProduct}>
                                            Ajouter
                                        </Button>
                                        <Button
                                            color="failure"
                                            onClick={onCloseAddProductModal}
                                        >
                                            Annuler
                                        </Button>
                                    </Modal.Footer>
                                </Modal>) : null}
                                */}

                                <AddProductModal />
                            </>
                        </div>


                    </div>
                </div>
                <div>
                    {!loading ? (<div className="relative overflow-x-auto sm:rounded-lg">
                        <Table hoverable={true}>
                            <Table.Head>
                                <Table.HeadCell>
                                    Numéro
                                </Table.HeadCell>
                                <Table.HeadCell>
                                    Libellé
                                </Table.HeadCell>
                                <Table.HeadCell>
                                    Producteurs
                                </Table.HeadCell>
                                <Table.HeadCell>
                                    Référence
                                </Table.HeadCell>
                                <Table.HeadCell>
                                    Type de produit
                                </Table.HeadCell>
                                <Table.HeadCell>
                                    Actions
                                </Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {products.map((product) => (
                                    <Table.Row
                                        className="cursor-pointer bg-white dark:bg-gray-800 dark:text-white font-semibold border-b border-gray-200 dark:border-gray-700"
                                        key={product.id}
                                        onClick={() => window.location.href = "/product/" + product.id}>
                                        <Table.Cell>
                                            {product.id}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {product.libelle}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {product.producteurs}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {product.reference}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {product.typeProduit}
                                        </Table.Cell>
                                        <Table.Cell className="flex space-x-2">
                                            <Button>
                                                <HiPencilAlt className="mr-2 text-lg"/>
                                                Modifier
                                            </Button>
                                            <Button color="failure">
                                                <HiTrash className="mr-2 text-lg"/>
                                                Supprimer
                                            </Button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>

                        <Pagination
                            nextLabel="Suivant"
                            previousLabel="Précédent"
                            className="text-center"
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => {
                                console.log(page)
                            }}
                        />
                    </div>) : (
                        <div className="text-center pt-40 flex items-center justify-center space-x-3">
                            <Spinner
                                aria-label="Extra large spinner example"
                                size="xl"
                                className="text-center"
                            />
                            <span className="dark:text-white">Chargement...</span>
                        </div>
                    )}
                </div>
            </div>
        </ConnectedLayout>
    );
}

export default Products;
