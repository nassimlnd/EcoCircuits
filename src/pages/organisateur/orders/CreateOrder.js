import React, {useEffect, useMemo, useState, Fragment} from "react";
import ConnectedLayout from "../../../layouts/ConnectedLayout";
import {Badge, Breadcrumb, Button, Label, Spinner, Table} from "flowbite-react";
import {HiHome, HiTrash} from "react-icons/hi";
import CustomersService from "../../../services/CustomersService";
import AddProductModal from "../../../components/orders/AddProductModal";
import ProducersService from "../../../services/ProducersService";
import {GoogleMap, MarkerF, useLoadScript} from "@react-google-maps/api";
import {Listbox, Transition} from "@headlessui/react";
import {CheckIcon, ChevronUpDownIcon} from "@heroicons/react/20/solid";
import {HiCheck, HiArrowLeft} from "react-icons/hi"
import AddAddressModal from "../../../components/customers/AddAddressModal";
import OrdersService from "../../../services/OrdersService";
import ProdMarker from "../../../components/map/ProdMarker";

/**
 * Page de création d'une commande
 * @returns {JSX.Element}
 * @constructor
 */
function CreateOrder() {
    const [loading, setLoading] = useState(false);

    const {isLoaded} = useLoadScript({
        googleMapsApiKey: "AIzaSyDEgpThm6jo_dKSlszn-iFF8io81KgEgXo",
    })

    const center = useMemo(() => ({lat: 47.383274, lng: 0.689797}), []);

    const [step1, setStep1] = useState(true);
    const [step2, setStep2] = useState(false);
    const [step3, setStep3] = useState(false);

    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState({});
    const [selectedAdresse, setSelectedAdresse] = useState({});
    const [products, setProducts] = useState([]);
    const [producers, setProducers] = useState([]);
    const [mapSelectedProduct, setMapSelectedProduct] = useState({});
    const [errorAnimation, setErrorAnimation] = useState(false);
    const [successAnimation, setSuccessAnimation] = useState(false);
    const [pendingAnimation, setPendingAnimation] = useState(false);

    const handleSelectCustomer = (customer) => {
        setSelectedAdresse({});
        setSelectedCustomer(customer);
    }

    async function onLaterClick() {
        let commande = {
            customer: selectedCustomer,
            products: products,
            adresse: selectedAdresse,
        }

    }

    const goStep2 = () => {
        if (selectedCustomer.id > -1 && selectedAdresse.id > -1) {
            console.log(selectedCustomer)
            setStep1(false);
            setStep2(true);
            document.getElementById("step1").classList.remove("bg-blue-700")
            document.getElementById("step1").classList.add("bg-gray-300");
            document.getElementById("step1").classList.add("dark:bg-gray-700");
            document.getElementById("step2").classList.remove("bg-gray-300");
            document.getElementById("step2").classList.remove("dark:bg-gray-700");
            document.getElementById("step2").classList.add("bg-blue-700");
        }
    }

    const goStep3 = async () => {
        if (products.length >= 1) {
            console.log(products)
            setStep2(false);
            setStep3(true);
            document.getElementById("step2").classList.remove("bg-blue-700")
            document.getElementById("step2").classList.add("bg-gray-300");
            document.getElementById("step2").classList.add("dark:bg-gray-700");
            document.getElementById("step3").classList.remove("bg-gray-300");
            document.getElementById("step3").classList.remove("dark:bg-gray-700");
            document.getElementById("step3").classList.add("bg-blue-700");
        }
    }

    const nextStep = async () => {
        if (step1) {
            goStep2();
        }
        if (step2) {
            setLoading(true);
            //await fetchProducersByProducts();
            setLoading(false);
            await goStep3();
        }
    }

    function handleSelectProduct(product) {
        console.log(product);
        setMapSelectedProduct(product);
        console.log(product.producers)
    }

    const backStep = () => {
        if (step3) {
            setStep2(true)
            setStep3(false);
            document.getElementById("step3").classList.remove("bg-blue-700")
            document.getElementById("step3").classList.add("bg-gray-300");
            document.getElementById("step3").classList.add("dark:bg-gray-700");
            document.getElementById("step2").classList.remove("bg-gray-300");
            document.getElementById("step2").classList.remove("dark:bg-gray-700");
            document.getElementById("step2").classList.add("bg-blue-700");
        } else if (step2) {
            setStep2(false);
            setStep1(true);
            document.getElementById("step2").classList.remove("bg-blue-700")
            document.getElementById("step2").classList.add("bg-gray-300");
            document.getElementById("step2").classList.add("dark:bg-gray-700");
            document.getElementById("step1").classList.remove("bg-gray-300");
            document.getElementById("step1").classList.remove("dark:bg-gray-700");
            document.getElementById("step1").classList.add("bg-blue-700");
        }
    }

    const addProduct = async (selected) => {
        setLoading(true)
        products.push(selected);
        await setProducts(products);
        setLoading(false);
    }

    const removeProduct = async (product) => {
        setLoading(true)
        products.splice(products.indexOf(product), 1);
        await setProducts(products);
        setLoading(false);
    }

    const fetchProducersByProducts = async () => {
        products.map(async (product) => {
            const response = await ProducersService.getProducersByProduct(product.id);
            product.producers = response.data;
        })

        setProducts(products);
    }

    const fetchData = async () => {
        setLoading(true)
        const responseCustomers = await CustomersService.getAll();
        setCustomers(responseCustomers.data);
        setSelectedCustomer(responseCustomers.data[0]);
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [])

    if (!isLoaded) return <div>Loading...</div>

    return (<ConnectedLayout>
        <div className="flex-grow">
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
                        <Breadcrumb.Item
                            href="/orders"
                        >
                            Commandes
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            Créer une nouvelle commande
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Créer une
                        nouvelle commande</h1>
                    <div>
                        <div className="flex justify-center items-center space-x-2 pt-8">
                            {step2 || step3 ? (
                                <Button color="gray" className="absolute left-4" onClick={backStep}><HiArrowLeft
                                    className="mr-2"/>Retour</Button>) : null}
                            <div id="step1" className="h-1 w-8 bg-blue-700">
                            </div>
                            <div id="step2" className="h-1 w-8 bg-gray-300 dark:bg-gray-700">
                            </div>
                            <div id="step3" className="h-1 w-8 bg-gray-300 dark:bg-gray-700">
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="dark:bg-gray-900 dark:text-white">
                {step1 && (<>
                    <div
                        className="text-xl bg-white dark:bg-gray-800 font-medium border-b border-gray-200 dark:border-gray-700 p-8">Étape
                        1 : Informations du
                        client
                    </div>

                    {!loading && !pendingAnimation && !successAnimation && !errorAnimation ? (
                        <>
                            <div id="form"
                                 className="md:flex md:space-x-4 md:justify-center space-y-2 md:-space-y-0 md:pt-12 pt-4 md:pl-4">
                                <div className="p-8 rounded-lg bg-white dark:bg-gray-800 shadow mx-4 md:w-1/2">
                                    <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                                        <Label
                                            className="text-lg"
                                            htmlFor="customers"
                                        >
                                            Choix du client
                                        </Label>
                                        <Listbox
                                            value={selectedCustomer}
                                            onChange={
                                                handleSelectCustomer
                                            }>
                                            <div className="relative mt-1">
                                                <Listbox.Button
                                                    className="relative w-full cursor-default rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                            <span
                                                className="block truncate">{selectedCustomer.nom} {selectedCustomer.prenom}</span>
                                                    <span
                                                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronUpDownIcon
                                                    className="h-5 w-5 text-gray-400 cursor-pointer"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                                </Listbox.Button>
                                                <Transition
                                                    as={Fragment}
                                                    leave="transition ease-in duration-100"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                >
                                                    <Listbox.Options
                                                        className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base dark:text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                        {customers.map((person, personIdx) => (<Listbox.Option
                                                            key={personIdx}
                                                            className={({active}) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900 dark:text-blue-900' : 'text-gray-900 dark:text-white'}`}
                                                            value={person}
                                                        >
                                                            {({selected}) => (<>
                                                        <span
                                                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                            {person.nom} {person.prenom}
                                                        </span>
                                                                {selected ? (
                                                                    <span
                                                                        className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                            <CheckIcon className="h-5 w-5" aria-hidden="true"/>
                                                        </span>) : null}
                                                            </>)}
                                                        </Listbox.Option>))}
                                                    </Listbox.Options>
                                                </Transition>
                                            </div>
                                        </Listbox>
                                    </div>
                                    <div className="pt-3">
                                        <div className="font-medium">Adresses de livraison</div>
                                        <div
                                            className="m-4 rounded-lg p-6 space-x-3 bg-gray-100 dark:bg-gray-900 flex items-center justify-start overflow-x-auto">
                                            {selectedCustomer.adresses && selectedCustomer.adresses.map((adresse) => (
                                                <div
                                                    key={adresse.id}
                                                    className="rounded cursor-pointer hover:dark:bg-gray-700 min-w-max p-4 dark:bg-gray-800 bg-white hover:bg-gray-200"
                                                    onClick={() => {
                                                        setSelectedAdresse(adresse);
                                                    }}
                                                >
                                                    <div className="flex justify-between font-medium">
                                                        <div>Adresse
                                                            n°{selectedCustomer.adresses.indexOf(adresse) + 1}</div>
                                                        <div>{selectedAdresse === adresse ? (
                                                            <Badge icon={HiCheck} color={"green"}/>) : null} </div>
                                                    </div>
                                                    <div className="pr-12">
                                                        <div>{adresse.rue}</div>
                                                        <div>{adresse.codePostal} {adresse.ville}</div>
                                                        <div>France</div>
                                                    </div>
                                                </div>
                                            ))}

                                            {selectedCustomer.adresses && selectedCustomer.adresses.length === 0 ? (
                                                <div
                                                    className="h-32 w-full flex flex-col items-center justify-center">Aucune
                                                    adresse de livraison pour ce client.</div>
                                            ) : null}

                                        </div>
                                        <div className="flex justify-end">
                                            <AddAddressModal fetchCustomers={fetchData} customers={customers}
                                                             oldSelect={selectedCustomer}/>
                                        </div>

                                    </div>
                                    <div
                                        className="pt-4 mt-4 flex flex-col items-center border-t border-gray-200 dark:border-gray-700">
                                        <Button
                                            onClick={nextStep}
                                        >
                                            Suivant
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div
                            className="flex flex-col items-center pt-4 mx-auto gap-y-6 text-center">
                            <Spinner
                                aria-label="Extra large spinner example"
                                size="xl"
                                className="text-center mb-4 mt-8"
                            />
                            <p className="text-lg mb-8 text-gray-500 dark:text-gray-300">
                                Chargement en cours...
                            </p>
                        </div>
                    )}
                </>)}
                {!loading && !successAnimation && !errorAnimation && !pendingAnimation && step2 && (<>
                    <div
                        className="text-xl p-8 bg-white dark:bg-gray-800 font-medium border-b border-gray-200 dark:border-gray-700">Étape
                        2 : Contenu de la commande
                    </div>


                    <div id="form"
                         className="md:flex md:space-x-4 md:justify-center space-y-2 md:-space-y-0 md:pt-12 pt-4 md:pl-4 px-4">
                        <div
                            className="flex-col p-8 rounded-lg dark:bg-gray-800 bg-white mb-4 shadow md:w-2/3 h-noscroll pb-12">
                            <div
                                className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
                                <div className="text-lg font-medium">Produits</div>
                                <div>
                                    <AddProductModal products={products} addProduct={addProduct}/>
                                </div>
                            </div>
                            <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto pb-3 h-4/5">
                                <Table hoverable={true}>
                                    <Table.Head>
                                        <Table.HeadCell>
                                            Numéro
                                        </Table.HeadCell>
                                        <Table.HeadCell>Libellé</Table.HeadCell>
                                        <Table.HeadCell>Référence</Table.HeadCell>
                                        <Table.HeadCell>Quantité</Table.HeadCell>
                                        <Table.HeadCell></Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body>
                                        {!loading ? (products.map((product) => (<Table.Row
                                            className="bg-white dark:bg-gray-800 dark:text-white font-semibold border-b border-gray-200 dark:border-gray-700"
                                            key={product.id}>
                                            <Table.Cell>
                                                {products.indexOf(product) + 1}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {product.libelle}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {product.reference}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {product.quantite}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <HiTrash className="fill-red-600 h-5 w-5 cursor-pointer"
                                                         onClick={() => {
                                                             removeProduct(product)
                                                         }}/>
                                            </Table.Cell>
                                        </Table.Row>))) : (<>
                                            <div
                                                className="text-center pt-40 flex items-center justify-center space-x-3">
                                                <Spinner
                                                    aria-label="Extra large spinner example"
                                                    size="xl"
                                                    className="text-center"
                                                />
                                                <span className="dark:text-white">Chargement...</span>
                                            </div>
                                        </>)}
                                    </Table.Body>
                                </Table>
                            </div>

                            <div className="pt-4 flex flex-col items-center">
                                <Button
                                    onClick={nextStep}
                                >
                                    Suivant
                                </Button>
                            </div>
                        </div>
                    </div>
                </>)}

                {!loading && !successAnimation && !errorAnimation && !pendingAnimation && step3 && isLoaded && (<>

                    <div
                        className="text-xl font-medium border-b border-gray-200 dark:border-gray-700 p-8 bg-white dark:bg-gray-800">Étape
                        3 : Affectation des producteurs
                    </div>
                    <div className="flex-grow m-8">
                        <div className="md:flex md:space-x-8 space-y-4 md:space-y-0">
                            <div className="md:w-1/3 bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
                                <div className="h-fit border-b border-gray-200 dark:border-gray-700 pb-3">
                                    <div className="text-lg font-medium">Produits</div>
                                </div>
                                <div className="pt-3 h-4/5 overflow-x-auto">
                                    <Table hoverable={true}>
                                        <Table.Head>
                                            <Table.HeadCell>
                                                Numéro
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                Produit
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                Quantité
                                            </Table.HeadCell>
                                            <Table.HeadCell>

                                            </Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body className="bg-gray-50 dark:bg-gray-800">
                                            {products.map((product) => (
                                                <Table.Row
                                                    key={product.id}
                                                    className="bg-white dark:bg-gray-800 cursor-pointer"
                                                    onClick={() => {
                                                        handleSelectProduct(product)
                                                    }}
                                                >
                                                    <Table.Cell>
                                                        {products.indexOf(product) + 1}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {product.libelle}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {product.quantite}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {mapSelectedProduct === product ?
                                                            <div><Badge icon={HiCheck} color="green"/></div> : null}
                                                    </Table.Cell>
                                                </Table.Row>))}
                                        </Table.Body>
                                    </Table>
                                </div>
                                <div
                                    className="flex flex-col items-center h-1/4 border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                                    <div className="flex space-x-3">
                                        <Button>
                                            Suivant
                                        </Button>
                                        <Button
                                            onClick={onLaterClick}
                                            color="gray">
                                            Plus tard
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-2/3">
                                <GoogleMap zoom={10}
                                           center={{lat: selectedAdresse.latitude, lng: selectedAdresse.longitude}}
                                           mapContainerClassName="h-noscroll rounded-lg shadow">
                                    {step3 && (
                                        <>
                                            <MarkerF
                                                position={{
                                                    lat: selectedAdresse.latitude,
                                                    lng: selectedAdresse.longitude
                                                }}
                                                icon={{
                                                    url: require("../../../assets/svg/Customer.svg").default
                                                }}
                                            />
                                        </>
                                    )}
                                    {step3 && mapSelectedProduct.id > 0 ?
                                        mapSelectedProduct.producers.map((producer) => <ProdMarker producer={producer}
                                                                                                   key={producer.id}/>) : null}
                                </GoogleMap>
                            </div>
                        </div>
                    </div>
                </>)}

                {loading && (
                    <div
                        className="flex h-noscroll items-center justify-center rounded-t px-5 pt-5 px-3 pt-3 pb-0">
                        {loading && (
                            <div
                                className="flex flex-col items-center pt-4 mx-auto gap-y-6 text-center">
                                <Spinner
                                    aria-label="Extra large spinner example"
                                    size="xl"
                                    className="text-center mb-4 mt-8"
                                />
                                <p className="text-lg mb-8 text-gray-500 dark:text-gray-300">
                                    Chargement en cours...
                                </p>
                            </div>)}
                        {successAnimation && (
                            <div
                                className="flex flex-col items-center pt-4 mx-auto gap-y-6 text-center">
                                {/*<svg stroke="currentColor" fill="none" stroke-width="0"
                                                         viewBox="0 0 24 24" className="text-7xl text-green-600"
                                                         height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                              stroke-width="2"
                                                              d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                    <svg className="fill-green-500 h-16 w-16 animate-jump-in animate-once animate-ease-out animate-normal animate-fill-forwards"
                                                        xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="0 0 256 256" id="Flat">
                                                        <path d="M174.89307,101.2384a3.99936,3.99936,0,0,1-.13184,5.65528l-58.666,56a3.99989,3.99989,0,0,1-5.52343,0l-29.334-28a4,4,0,0,1,5.52344-5.78711l26.57227,25.36377,55.90429-53.36377A3.99936,3.99936,0,0,1,174.89307,101.2384Zm53.10644,26.76172a100,100,0,1,1-100-100A100.113,100.113,0,0,1,227.99951,128.00012Zm-8,0a92,92,0,1,0-92,92A92.10447,92.10447,0,0,0,219.99951,128.00012Z"/>
                                                    </svg>*/}
                                <svg
                                    className="checkmark"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 52 52"
                                >
                                    <circle className="checkmark__circle" cx="26" cy="26" r="25"
                                            fill="none"/>
                                    <path
                                        className="checkmark__check"
                                        fill="none"
                                        d="M14.1 27.2l7.1 7.2 16.7-16.8"
                                    />
                                </svg>
                                <p className="text-lg pb-8 dark:text-gray-300">
                                    Client crée avec succès !
                                </p>
                            </div>
                        )}
                        {errorAnimation && (
                            <div
                                className="flex flex-col items-center pt-4 mx-auto gap-y-6 text-center">
                                <div
                                    className="mb-4 mt-10 rounded-full border-4 border-red-600">
                                    <svg className="fill-red-600"
                                         stroke="currentColor" fill="none" stroke-width="0"
                                         viewBox="0 0 24 24" className="text-7xl text-red-600"
                                         height="1em" width="1em"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                              stroke-width="2"
                                              d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </div>

                                <p className="text-lg mb-8 dark:text-gray-300">
                                    Une erreur est survenue lors de la création du client.
                                </p>
                            </div>)}
                        {pendingAnimation && (
                            <>
                                <div
                                    className="flex flex-col items-center pt-4 mx-auto gap-y-6 text-center">
                                    <div
                                        className="mb-4 mt-10 rounded-full border-4 border-red-600">
                                        <svg className="fill-red-600"
                                             stroke="currentColor" fill="none" stroke-width="0"
                                             viewBox="0 0 24 24" className="text-7xl text-orange-500"
                                             height="1em" width="1em"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                  stroke-width="2"
                                                  d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </div>

                                    <p className="text-lg mb-8 dark:text-gray-300">
                                        La commande a été mise en attente.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    </ConnectedLayout>)
}

export default CreateOrder;