import os
import re

root_dir = r"C:\Users\r9979\OneDrive\Desktop\Data"

print("Fixing filenames safely...")

for subdir, _, files in os.walk(root_dir):
    for f in files:
        old_path = os.path.join(subdir, f)

        # Remove trailing and internal spaces before extension
        new_name = f.rstrip()
        new_name = re.sub(r"\s+\.", ".", new_name)
        new_name = re.sub(r"\s{2,}", " ", new_name)

        new_path = os.path.join(subdir, new_name)

        # If filename already exists → add a number
        if os.path.exists(new_path) and old_path != new_path:
            base, ext = os.path.splitext(new_name)
            counter = 1
            while True:
                new_name2 = f"{base}_{counter}{ext}"
                new_path = os.path.join(subdir, new_name2)
                if not os.path.exists(new_path):
                    print(f"Conflict fixed: {new_name} -> {new_name2}")
                    break
                counter += 1

        # Rename file
        if old_path != new_path:
            print(f"Renaming -> {old_path}  -->  {new_path}")
            os.rename(old_path, new_path)

print("Done fixing filenames.")
