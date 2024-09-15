
import OrderModel from '../models/OrderModel.js'

class OrderController {

 static createOrder = async (req, res) => {
    try {
        const order = new OrderModel(req.body);
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all orders
static getAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find().populate('userId').populate('items.productId');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
static getSalesData = async (req, res) => {
    const { startDate, endDate, productId } = req.query;
    try {
        const query = {};
        if (startDate && endDate) {
            query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (productId) {
            query['items.productId'] = productId;
        }
        const orders = await OrderModel.find(query)
            .populate('items.productId')
            .exec();
        const salesData = OrderController.aggregateSalesData(orders);
        res.status(200).json(salesData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

static aggregateSalesData = (orders) => {
    return {
        labels: orders.map(order => order.createdAt.toISOString().split('T')[0]),
        lineData: orders.map(order => order.items.reduce((sum, item) => sum + item.quantity, 0)),
        barData: orders.map(order => order.items.length),
        pieData: orders.map(order => order.items.reduce((sum, item) => sum + item.quantity, 0))
    };
};
// Get a single order by ID
static getOrderById = async (req, res) => {
    try {
        const order = await OrderModel.findById(req.params.id).populate('userId').populate('items.productId');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an order by ID
static updateOrder = async (req, res) => {
    try {
        const order = await OrderModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an order by ID
static deleteOrder = async (req, res) => {
    try {
        const order = await OrderModel.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
}
export default  OrderController ;
