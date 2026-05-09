/**
 * Test Script for Centralized Authentication & RBAC System
 * 
 * This script tests the complete flow:
 * 1. User login → JWT tokens
 * 2. Access protected resource with permissions
 * 3. Test insufficient permissions → 403 Forbidden
 */

const http = require('http');

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testAuthFlow() {
  console.log('🧪 Testing Centralized Authentication & RBAC System\n');
  
  try {
    // Test 1: Health Checks
    console.log('1️⃣ Testing Health Checks...');
    
    const authHealth = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/health',
      method: 'GET'
    });
    
    const resourceHealth = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/health',
      method: 'GET'
    });
    
    console.log(`   Auth Service: ${authHealth.statusCode === 200 ? '✅' : '❌'}`);
    console.log(`   Resource Service: ${resourceHealth.statusCode === 200 ? '✅' : '❌'}\n`);
    
    // Test 2: Admin Login
    console.log('2️⃣ Testing Admin Login...');
    
    const loginResponse = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: 'admin@example.com',
      password: 'Admin@123'
    });
    
    if (loginResponse.statusCode === 200) {
      const loginData = JSON.parse(loginResponse.body);
      const accessToken = loginData.data.accessToken;
      console.log('   ✅ Admin login successful');
      console.log(`   📝 Permissions: ${loginData.data.user.permissions.join(', ')}\n`);
      
      // Test 3: Access Protected Resource (Admin can read orders)
      console.log('3️⃣ Testing Protected Resource Access (Admin - orders:read)...');
      
      const ordersResponse = await makeRequest({
        hostname: 'localhost',
        port: 5001,
        path: '/orders',
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (ordersResponse.statusCode === 200) {
        console.log('   ✅ Orders accessed successfully');
        const ordersData = JSON.parse(ordersResponse.body);
        console.log(`   📦 Found ${ordersData.data.total} orders\n`);
      } else {
        console.log(`   ❌ Failed to access orders: ${ordersResponse.statusCode}\n`);
      }
      
      // Test 4: Create Order (Admin can write orders)
      console.log('4️⃣ Testing Order Creation (Admin - orders:write)...');
      
      const createResponse = await makeRequest({
        hostname: 'localhost',
        port: 5001,
        path: '/orders',
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }, {
        item: 'Test Laptop',
        qty: 1,
        price: 99999
      });
      
      if (createResponse.statusCode === 201) {
        console.log('   ✅ Order created successfully\n');
      } else {
        console.log(`   ❌ Failed to create order: ${createResponse.statusCode}\n`);
      }
      
    } else {
      console.log(`   ❌ Admin login failed: ${loginResponse.statusCode}`);
      console.log(`   📝 Error: ${loginResponse.body}\n`);
    }
    
    // Test 5: Regular User Login
    console.log('5️⃣ Testing Regular User Login...');
    
    const userLoginResponse = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: 'user@example.com',
      password: 'User@1234'
    });
    
    if (userLoginResponse.statusCode === 200) {
      const userLoginData = JSON.parse(userLoginResponse.body);
      const userAccessToken = userLoginData.data.accessToken;
      console.log('   ✅ User login successful');
      console.log(`   📝 Permissions: ${userLoginData.data.user.permissions.join(', ')}\n`);
      
      // Test 6: User can read orders
      console.log('6️⃣ Testing User Orders Access (User - orders:read)...');
      
      const userOrdersResponse = await makeRequest({
        hostname: 'localhost',
        port: 5001,
        path: '/orders',
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${userAccessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (userOrdersResponse.statusCode === 200) {
        console.log('   ✅ User can read orders\n');
      } else {
        console.log(`   ❌ User cannot read orders: ${userOrdersResponse.statusCode}\n`);
      }
      
      // Test 7: User cannot delete orders (should be 403)
      console.log('7️⃣ Testing Permission Denial (User - orders:delete)...');
      
      const deleteResponse = await makeRequest({
        hostname: 'localhost',
        port: 5001,
        path: '/orders/1',
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${userAccessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (deleteResponse.statusCode === 403) {
        console.log('   ✅ Permission correctly denied (403 Forbidden)\n');
      } else {
        console.log(`   ❌ Permission not denied: ${deleteResponse.statusCode}\n`);
      }
      
    } else {
      console.log(`   ❌ User login failed: ${userLoginResponse.statusCode}\n`);
    }
    
    // Test 8: Invalid Token
    console.log('8️⃣ Testing Invalid Token...');
    
    const invalidTokenResponse = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/orders',
      method: 'GET',
      headers: { 
        'Authorization': 'Bearer invalid.token.here',
        'Content-Type': 'application/json'
      }
    });
    
    if (invalidTokenResponse.statusCode === 401) {
      console.log('   ✅ Invalid token rejected (401 Unauthorized)\n');
    } else {
      console.log(`   ❌ Invalid token not rejected: ${invalidTokenResponse.statusCode}\n`);
    }
    
    console.log('🎉 Authentication & RBAC System Test Complete!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure both services are running:');
    console.log('   Auth Service: http://localhost:5000');
    console.log('   Resource Service: http://localhost:5001');
    console.log('   MongoDB: mongodb://localhost:27017');
  }
}

// Run the test
testAuthFlow();
