import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';

import Panier from '../../assets/images/paniers.png';
import Compte from '../../assets/images/utilisateur.png';
import Favoris from '../../assets/images/favori.png';

// Interface pour les informations de livraison
interface DeliveryInfo {
    firstName: string;
    lastName: string;
    university: string;
    building?: string;
    phoneNumber: string;
    address: string;
    postalCode: string;
    city: string;
    additionalInfo?: string;
}

// Interface pour les props du composant DeliveryFormModal
interface DeliveryFormModalProps {
    visible: boolean;
    onClose: () => void;
    deliveryInfo: DeliveryInfo;
    setDeliveryInfo: React.Dispatch<React.SetStateAction<DeliveryInfo>>;
    onSubmit: () => void;
}

const DeliveryFormModal: React.FC<DeliveryFormModalProps> = ({
    visible,
    onClose,
    deliveryInfo,
    setDeliveryInfo,
    onSubmit
}) => (
    <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
    >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Informations de livraison</Text>

                <ScrollView style={styles.formContainer}>
                    <Text style={styles.inputLabel}>Prénom *</Text>
                    <TextInput
                        style={styles.input}
                        value={deliveryInfo.firstName}
                        onChangeText={(text) => setDeliveryInfo({ ...deliveryInfo, firstName: text })}
                        placeholder="Votre prénom"
                    />

                    <Text style={styles.inputLabel}>Nom *</Text>
                    <TextInput
                        style={styles.input}
                        value={deliveryInfo.lastName}
                        onChangeText={(text) => setDeliveryInfo({ ...deliveryInfo, lastName: text })}
                        placeholder="Votre nom"
                    />

                    <Text style={styles.inputLabel}>Université *</Text>
                    <TextInput
                        style={styles.input}
                        value={deliveryInfo.university}
                        onChangeText={(text) => setDeliveryInfo({ ...deliveryInfo, university: text })}
                        placeholder="Nom de votre université"
                    />

                    <Text style={styles.inputLabel}>Adresse *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Votre adresse"
                        value={deliveryInfo.address}
                        onChangeText={(text) => setDeliveryInfo({ ...deliveryInfo, address: text })}
                    />

                    <Text style={styles.inputLabel}>Code Postal *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Votre code postal"
                        keyboardType="numeric"
                        value={deliveryInfo.postalCode}
                        onChangeText={(text) => setDeliveryInfo({ ...deliveryInfo, postalCode: text })}
                    />

                    <Text style={styles.inputLabel}>Ville *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Votre ville"
                        value={deliveryInfo.city}
                        onChangeText={(text) => setDeliveryInfo({ ...deliveryInfo, city: text })}
                    />

                    <Text style={styles.inputLabel}>Bâtiment</Text>
                    <TextInput
                        style={styles.input}
                        value={deliveryInfo.building}
                        onChangeText={(text) => setDeliveryInfo({ ...deliveryInfo, building: text })}
                        placeholder="Bâtiment (optionnel)"
                    />

                    <Text style={styles.inputLabel}>Salle</Text>
                    <TextInput
                        style={styles.input}
                        value={deliveryInfo.building}
                        onChangeText={(text) => setDeliveryInfo({ ...deliveryInfo, building: text })}
                        placeholder="Salle (optionnel)"
                    />

                    <Text style={styles.inputLabel}>Numéro de téléphone *</Text>
                    <TextInput
                        style={styles.input}
                        value={deliveryInfo.phoneNumber}
                        onChangeText={(text) => setDeliveryInfo({ ...deliveryInfo, phoneNumber: text })}
                        placeholder="Votre numéro de téléphone"
                        keyboardType="phone-pad"
                    />

                    <Text style={styles.inputLabel}>Informations complémentaires</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={deliveryInfo.additionalInfo}
                        onChangeText={(text) => setDeliveryInfo({ ...deliveryInfo, additionalInfo: text })}
                        placeholder="Instructions particulières pour la livraison"
                        multiline
                        numberOfLines={4}
                    />
                </ScrollView>

                <View style={styles.modalButtons}>
                    <TouchableOpacity
                        style={[styles.modalButton, styles.cancelButton]}
                        onPress={onClose}
                    >
                        <Text style={styles.cancelButtonText}>Annuler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.modalButton, styles.confirmButton]}
                        onPress={onSubmit}
                    >
                        <Text style={styles.confirmButtonText}>Valider</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
);

// Interface pour les items de commande
interface OrderItem {
    id: string;
    nom: string;
    quantity: number;
}

// Interface pour les commandes
interface Order {
    id: string;
    status: 'in-progress' | 'delivered';
    items: OrderItem[];
    remainingTime?: number;
}

// Interface pour les props du composant OrderTrackingCard
interface OrderTrackingCardProps {
    order: Order;
    formatTime: (seconds: number) => string;
}

const OrderTrackingCard: React.FC<OrderTrackingCardProps> = ({ order, formatTime }) => (
    <View style={styles.orderTrackingCard}>
        <Text style={styles.orderTrackingTitle}>Commande {order.status === 'delivered' ? 'livrée' : 'en cours'}</Text>
        {order.status === 'in-progress' && (
            <>
                <Text style={styles.orderTrackingStatus}>En cours de préparation</Text>
                <Text style={styles.orderTrackingETA}>Arrivée estimée dans {formatTime(order.remainingTime!)}</Text>
            </>
        )}
        <View style={styles.orderItemsContainer}>
            {order.items.map((item) => (
                <View key={item.id} style={styles.orderItem}>
                    <Text style={styles.orderItemName}>{item.nom}</Text>
                    <Text style={styles.orderItemQuantity}>x{item.quantity}</Text>
                </View>
            ))}
        </View>
    </View>
);

// Interface pour les props du composant OrdersPopup
interface OrdersPopupProps {
    visible: boolean;
    onClose: () => void;
    orders: Order[];
    formatTime: (seconds: number) => string;
}

const OrdersPopup: React.FC<OrdersPopupProps> = ({ visible, onClose, orders, formatTime }) => (
    <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
    >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Commandes</Text>
                {orders.length > 0 ? (
                    <ScrollView style={styles.ordersContainer}>
                        {orders.map((order) => (
                            <OrderTrackingCard key={order.id} order={order} formatTime={formatTime} />
                        ))}
                    </ScrollView>
                ) : (
                    <Text style={styles.noOrdersText}>Aucune commande</Text>
                )}
                <TouchableOpacity
                    style={[styles.modalButtonCommande, styles.cancelButton]}
                    onPress={onClose}
                >
                    <Text style={styles.cancelButtonText}>Fermer</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);

// Interface pour les items du panier
interface CartItem {
    id: string;
    nom: string;
    prix: number;
    quantity: number;
    image: string;
}

const CartScreen: React.FC = () => {
    const router = useRouter();
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        balance,
        processOrder
    } = useCart();
    const { orders, addOrder } = useOrder();
    const totalItemsInCart = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);
    const [showDeliveryForm, setShowDeliveryForm] = useState(false);
    const [showOrdersPopup, setShowOrdersPopup] = useState(false);
    const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
        firstName: '',
        lastName: '',
        university: '',
        building: '',
        phoneNumber: '',
        address: '',
        postalCode: '',
        city: '',
        additionalInfo: ''
    });

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            Alert.alert("Panier vide", "Veuillez ajouter des articles à votre panier avant de passer commande.");
            return;
        }
        setShowDeliveryForm(true);
    };

    const handleSubmitDeliveryInfo = () => {
        if (!deliveryInfo.firstName || !deliveryInfo.lastName || !deliveryInfo.university ||
            !deliveryInfo.phoneNumber || !deliveryInfo.address || !deliveryInfo.postalCode ||
            !deliveryInfo.city) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
            return;
        }

        const total = getCartTotal();
        if (total > balance) {
            Alert.alert(
                "Solde insuffisant",
                `Votre solde CROUS (${balance.toFixed(2)}€) ne permet pas de payer cette commande (${total.toFixed(2)}€).`
            );
            return;
        }

        Alert.alert(
            "Confirmer la commande",
            `Total: ${total.toFixed(2)}€\nSolde actuel: ${balance.toFixed(2)}€\nSolde après achat: ${(balance - total).toFixed(2)}€`,
            [
                {
                    text: "Annuler",
                    style: "cancel"
                },
                {
                    text: "Confirmer",
                    onPress: () => {
                        if (processOrder(total)) {
                            addOrder([...cartItems]);
                            setShowDeliveryForm(false);
                            router.push('/components/success-screen');
                        }
                    }
                }
            ]
        );
    };

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes} min ${remainingSeconds} s`;
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            {/* Navbar */}
            <SafeAreaView style={styles.navbarContainer}>
                <View style={styles.navbar}>
                    <TouchableOpacity onPress={() => router.push('/screen/MainScreen')}>
                        <Text style={styles.title}>DeliveCrous</Text>
                    </TouchableOpacity>
                    <View style={styles.navbarImages}>
                        <TouchableOpacity onPress={() => router.replace('/screen/favorites')}>
                            <Image source={Favoris} style={styles.navbarImage} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/screen/user')}>
                            <Image source={Compte} style={styles.navbarImage} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={styles.cartIconContainer}>
                                <Image source={Panier} style={[styles.navbarImage, { tintColor: '#2ecc71' }]} />
                                {totalItemsInCart > 0 && (
                                    <View style={styles.cartBadge}>
                                        <Text style={styles.cartBadgeText}>{totalItemsInCart}</Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>

            {/* Bouton retour */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push('/screen/MainScreen')}
            >
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Mon Panier</Text>
                <Text>Solde CROUS : {balance.toFixed(2)}€</Text>
            </View>

            {cartItems.length === 0 ? (
                <View style={styles.emptyCartContainer}>
                    <Ionicons name="cart-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyCartText}>Votre panier est vide</Text>
                    <TouchableOpacity
                        style={styles.continueShopping}
                        onPress={() => router.push('/')}
                    >
                        <Text style={styles.continueShoppingText}>Continuer mes achats</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <ScrollView style={styles.cartItemsContainer}>
                        {cartItems.map((item: any) => (
                            <View key={item.id} style={styles.cartItemContainer}>
                                <Image source={{ uri: item.image }} style={styles.itemImage} />
                                <View style={styles.itemDetailsContainer}>
                                    <Text style={styles.itemName}>{item.nom}</Text>
                                    <Text style={styles.itemPrice}>{item.prix.toFixed(2)} €</Text>
                                    <View style={styles.quantityContainer}>
                                        <TouchableOpacity
                                            onPress={() => updateQuantity(item.id, item.quantity - 1)}
                                        >
                                            <Ionicons name="remove-circle-outline" size={24} color="#2ecc71" />
                                        </TouchableOpacity>
                                        <Text style={styles.quantityText}>{item.quantity}</Text>
                                        <TouchableOpacity
                                            onPress={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            <Ionicons name="add-circle-outline" size={24} color="#2ecc71" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={styles.removeItemButton}
                                    onPress={() => removeFromCart(item.id)}
                                >
                                    <Ionicons name="trash-outline" size={24} color="#e74c3c" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>

                    <View style={styles.cartSummaryContainer}>
                        <Text style={styles.totalText}>Total: {getCartTotal().toFixed(2)} €</Text>
                        <TouchableOpacity
                            style={styles.checkoutButton}
                            onPress={handleCheckout}
                        >
                            <Text style={styles.checkoutButtonText}>Passer commande</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}

            {/* Bouton pour afficher les commandes */}
            <TouchableOpacity
                style={styles.ordersButton}
                onPress={() => setShowOrdersPopup(true)}
            >
                <Text style={styles.ordersButtonText}>Voir les commandes</Text>
            </TouchableOpacity>

            <OrdersPopup
                visible={showOrdersPopup}
                onClose={() => setShowOrdersPopup(false)}
                orders={orders}
                formatTime={formatTime}
            />

            <DeliveryFormModal
                visible={showDeliveryForm}
                onClose={() => setShowDeliveryForm(false)}
                deliveryInfo={deliveryInfo}
                setDeliveryInfo={setDeliveryInfo}
                onSubmit={handleSubmitDeliveryInfo}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    navbarContainer: {
        backgroundColor: '#fff',
    },
    navbar: {
        height: 60,
        backgroundColor: 'rgb(250,250,250)',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        justifyContent: 'space-between',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 15,
        marginTop: 30,
    },
    navbarImages: {
        flexDirection: 'row',
    },
    navbarImage: {
        width: 25,
        height: 25,
        marginRight: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    cartIconContainer: {
        position: 'relative',
    },
    cartBadge: {
        position: 'absolute',
        right: -5,
        top: -5,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    backButton: {
        position: 'absolute',
        top: 105,
        left: 15,
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        padding: 16,
        paddingTop: 60,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    emptyCartText: {
        fontSize: 18,
        color: '#666',
        marginTop: 16,
        marginBottom: 24,
    },
    continueShopping: {
        backgroundColor: '#2ecc71',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    continueShoppingText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cartItemsContainer: {
        flex: 1,
    },
    cartItemContainer: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        padding: 12,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    itemDetailsContainer: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemPrice: {
        fontSize: 16,
        color: '#2ecc71',
        fontWeight: 'bold',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 16,
        marginHorizontal: 8,
    },
    removeItemButton: {
        justifyContent: 'center',
        padding: 8,
    },
    cartSummaryContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    checkoutButton: {
        backgroundColor: '#2ecc71',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    formContainer: {
        maxHeight: '80%',
    },
    noOrdersText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
        textAlign: 'center',
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    modalButtonCommande: {
        padding: 5,
        borderRadius: 8,
        marginHorizontal: 80,
    },
    cancelButton: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    confirmButton: {
        backgroundColor: '#2ecc71',
    },
    cancelButtonText: {
        color: '#333',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    confirmButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    orderTrackingCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        margin: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    orderTrackingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    orderTrackingStatus: {
        fontSize: 16,
        color: '#2ecc71',
        marginBottom: 4,
    },
    orderTrackingETA: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    orderItemsContainer: {
        marginTop: 16,
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    orderItemName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    orderItemQuantity: {
        fontSize: 16,
        color: '#666',
    },
    ordersContainer: {
        paddingBottom: 20,
    },
    ordersButton: {
        backgroundColor: '#3498db',
        opacity: 0.8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    ordersButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CartScreen;
