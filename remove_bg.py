import os
from rembg import remove

cars_dir = r"c:\Users\HP\sabi\public\cars"

for filename in os.listdir(cars_dir):
    if filename.endswith(".png"):
        input_path = os.path.join(cars_dir, filename)
        # We will save it as a temporary file first, then replace
        temp_path = os.path.join(cars_dir, "temp_" + filename)
        
        with open(input_path, 'rb') as i:
            with open(temp_path, 'wb') as o:
                input_data = i.read()
                output_data = remove(input_data)
                o.write(output_data)
        
        os.replace(temp_path, input_path)
        print(f"Removed background for {filename}")
