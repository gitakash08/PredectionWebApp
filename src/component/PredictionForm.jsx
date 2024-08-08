import React, { useState } from 'react';
import axios from 'axios';
import { Card, Form, Input, Button, Row, Col } from 'antd';

const PredictionForm = () => {
    const [formData, setFormData] = useState({
        Truck_Count: '',
        Invoice_Count: '',
        Route_Violation_Count: '',
        Speed_Violation_Count: '',
        Stoppage_Violation_Count: '',
        Night_Violation_Count: '',
    });
    const [prediction, setPrediction] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:5000/predict', {
                features: Object.values(formData).map(Number),
            });
            setPrediction(response.data.prediction);
        } catch (error) {
            console.error('Error making prediction:', error);
        }
    };

    return (
        <div style={{ padding: '50px', maxWidth: '600px', margin: '0 auto' }}>
            <Card title="Transporter Performance Prediction" bordered={false}>
                <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    {Object.keys(formData).map((key) => (
                        <Form.Item
                            key={key}
                            label={key.replace(/_/g, ' ')}
                            rules={[{ required: true, message: `Please input ${key.replace(/_/g, ' ')}!` }]}
                        >
                            <Input
                                type="number"
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                required
                            />
                        </Form.Item>
                    ))}
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Predict
                        </Button>
                    </Form.Item>
                </Form>
                {prediction !== null && (
                    <Card
                        title="Prediction Result"
                        bordered={false}
                        style={{ marginTop: '20px' }}
                    >
                        <h3>
                            Prediction From ML Model: {prediction === 1 ? <p style={{color:'green'}}>In Top 10 Best Performer Transporters List</p> : <p style={{color:'red'}}>Not In Top 10 Best Performer Transporters List</p>}
                        </h3>
                    </Card>
                )}
            </Card>
        </div>
    );
};

export default PredictionForm;
