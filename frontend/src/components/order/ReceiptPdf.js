import React from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    body: {
        padding: 50,
    },
    header: {
        marginBottom: 30,
    },
    footer: {
        marginBottom: 30,
    },
    Amount: {
        marginBottom: 30,
    },
    title: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold",
    },
    data: {
        fontSize: 15,
        textAlign: "left",
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 14,
        textAlign: "center",
        color: "grey",
    },
    table: {
        display: "table",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0
    },
    tableRow: {
        margin: "auto",
        flexDirection: "row"
    },
    tableCol: {
        width: "20%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0
    },
    tableCell: {
        margin: "auto",
        marginTop: 5,
        fontSize: 10
    },
    image: {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 30,
        height: 30,
    },
});

const Receipt = ({ order }) => (
    <Document>
        <Page style={styles.body}>
            <View style={styles.header}>
                <Text style={styles.title}>Shoe-Shop</Text>
                <Text style={styles.subtitle}>Date Delivered: {order.deliveredAt}</Text>
            </View>
            <View style={styles.header}>
                <Text style={styles.data}>Order # - {order._id}</Text>
                <Text style={styles.data}>Customer Name: {order.user.name}</Text>
                <Text style={styles.data}>Address: {order.shippingInfo.address}, {order.shippingInfo.city}</Text>

                <Text style={styles.data}>Postal Code: {order.shippingInfo.postalCode}</Text>
                <Text style={styles.data}>Country: {order.shippingInfo.country}</Text>
            </View>
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Image</Text>
                    </View>
                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Item name</Text>
                    </View>
                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Price</Text>
                    </View>
                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Quantity</Text>
                    </View>
                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Total</Text>
                    </View>
                </View>
                {order.orderItems.map((item) => (
                <View style={styles.tableRow}>
                    <View style={styles.tableCol}>
                            <Image style={styles.image} src={item.image} />
                    </View>
                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>{item.name}</Text>
                    </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{item.price}</Text>
                        </View>
                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>{item.quantity} Piece(s)</Text>
                    </View>
                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>{item.price * item.quantity}</Text>
                    </View>
                </View>
                ))}
            </View>
            <View style={styles.Amount}>
                <Text style={styles.title}>Total Amount: ${order.totalPrice}</Text>
            </View>

            <View style={styles.footer}>
                <Text style={styles.title}>Order Receipt</Text>
                <Text style={styles.subtitle}>Thank you for your purchase!</Text>
            </View>
        </Page>
    </Document>
);

export default Receipt
