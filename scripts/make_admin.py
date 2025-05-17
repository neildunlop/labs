import requests
import json

def make_user_admin(email: str):
    # First, get the user's ID by email
    response = requests.get(
        'http://localhost:8000/api/admin/users',
        headers={
            'Authorization': f'Bearer {input("Enter admin token: ")}'
        }
    )
    
    if response.status_code != 200:
        print(f"Error fetching users: {response.text}")
        return
    
    users = response.json()
    user = next((u for u in users if u['email'] == email), None)
    
    if not user:
        print(f"User with email {email} not found")
        return
    
    # Update the user's role to admin
    update_response = requests.put(
        f'http://localhost:8000/api/admin/users/{user["id"]}',
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {input("Enter admin token again: ")}'
        },
        json={
            'role': 'admin'
        }
    )
    
    if update_response.status_code == 200:
        print(f"Successfully made {email} an admin")
    else:
        print(f"Error updating user: {update_response.text}")

if __name__ == '__main__':
    make_user_admin('neil.dunlop@gmail.com') 